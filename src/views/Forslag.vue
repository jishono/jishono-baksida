<template>
  <v-container
    fluid
    class="pa-2 ma-0"
  >
    <v-dialog
      v-model="endre_dialog"
      width="500"
      v-if="current_forslag"
    >
      <v-card>
        <v-card-title v-if="$store.getters.isAdmin">{{ $t('forslag.rediger_godkjenn') }}</v-card-title>
        <v-card-title v-else>{{ $t('forslag.rediger_forslag') }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="redigert_forslag"
            counter
            maxlength="100"
            outlined
          ></v-text-field>
          <span v-if="$store.getters.user_id == current_forslag.user_id">
            {{ $t('forslag.rediger_forslag_advarsel') }}
          </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            dark
            @click="endre_dialog = false"
          >
            {{ $t('knapper.avbryt') }}
          </v-btn>
          <v-btn
            v-if="$store.getters.user_id == current_forslag.user_id"
            color="green"
            dark
            @click="redigerForslag(current_forslag)"
          >
            {{ $t('knapper.oppdater') }}
          </v-btn>
          <v-btn
            v-if="$store.getters.isAdmin"
            color="green"
            dark
            @click="godkjennForslag(current_forslag)"
          >
            {{ $t('knapper.godkjenn') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="kommentar_dialog"
      width="500"
    >
      <forslag-kommentarer
        v-bind:forslag_id="this.current_forslag_id"
        @close="kommentar_dialog = false; refresh()"
      ></forslag-kommentarer>

    </v-dialog>
    <v-tabs
      centered
      v-model="tab"
      class="mb-2"
    >
      <v-tab>
        {{ $t('forslag.alle') }}
      </v-tab>
      <v-tab>
        {{ $t('forslag.mine') }}
      </v-tab>
    </v-tabs>
    <v-row
      no-gutters
      v-if="tab == 0"
    >
      <v-col align="center">
        <span
          v-for="(statuskode, index) in forslag_status"
          :key="statuskode.text"
        >
          <v-chip
            class="mt-3 mx-2"
            small
            :color="statuskode.color + filterFarge(index)"
            dark
            @click="filter_status = index"
          >
            {{ statuskode.text }}
          </v-chip>
        </span>
      </v-col>
    </v-row>

    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Søk"
    ></v-text-field>
    <v-data-table
      :headers="currentHeaders"
      :search="search"
      :items="filtrerteForslag"
      :footer-props="{
                      'items-per-page-options': [5, 10, 20, 30, 40, 50]
                       }"
      :items-per-page="20"
      :header-props="{ sortIcon: null }"
      sort-by="opprettet"
      :sort-desc="true"
      class="elevation-1"
      mobile-breakpoint="1030"
    >
      <template v-slot:item.lemma_id="{ item }">
        <div style="width: 60px">
          <router-link
            v-if="$store.getters.isAdmin"
            :to="{path: 'endre/' + item.lemma_id}"
          >{{ item.lemma_id}}</router-link>
          <span v-else>{{ item.lemma_id }}</span>
        </div>
      </template>
      <template v-slot:item.forslag_definisjon="{ item }">
        {{item.forslag_definisjon}}

        <v-btn
          class="float-right"
          icon
          x-small
          color="red lighten-1"
          v-if="item.user_id == $store.getters.user_id && item.status == 0"
          @click="fjernForslag(item)"
        >
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
        <div class="float-right">

          <v-btn
            icon
            x-small
            color="green"
            v-if="$store.getters.isAdmin && item.status == 0"
            @click="openEndreDialog(item)"
          >
            <v-icon>
              mdi-check-circle-outline
            </v-icon>
          </v-btn>
          <v-btn
            icon
            x-small
            color="red"
            v-if="$store.getters.isAdmin && item.status == 0"
            @click="avvisForslag(item)"
          >
            <v-icon>
              mdi-close-box
            </v-icon>
          </v-btn>
          <v-btn
            icon
            x-small
            color="red lighten-1"
            v-if="item.user_id == $store.getters.user_id && item.status == 0"
            @click="openEndreDialog(item)"
          >
            <v-icon>
              mdi-pencil-outline
            </v-icon>
          </v-btn>
        </div>
      </template>
      <template v-slot:item.upvotes="{ item }">
        <div
          class=""
          style="width: 165px"
        >
          <v-chip
            :color="getColorUp(item)"
            class="mr-1 px-2"
            text-color="white"
            small
            @click="stemForslag(item, 1)"
          >
            <span class="ml-1 mr-2">
              {{ item.upvotes}}
            </span>
            <v-icon
              :x-small="$vuetify.breakpoint.mdAndDown"
              small
              dark
            >
              mdi-thumb-up-outline
            </v-icon>
          </v-chip>
          <v-chip
            class="mr-1 px-2"
            :color="getColorDown(item)"
            text-color="white"
            small
            @click="stemForslag(item, 0)"
          >
            <span class="ml-1 mr-2">
              {{ item.downvotes}}
            </span>
            <v-icon
              :x-small="$vuetify.breakpoint.mdAndDown"
              small
              dark
            >
              mdi-thumb-down-outline
            </v-icon>
          </v-chip>
          <v-chip
            class="mr-1 px-2"
            :color="kommentarFarge(item.nyere)"
            text-color="white"
            small
            @click="openKommentarDialog(item.forslag_id)"
          >
            <span class="ml-1 mr-2">
              {{ item.antall_kommentarer}}
            </span>

            <v-icon
              small
              :x-small="$vuetify.breakpoint.mdAndDown"
            >
              mdi-comment-text-outline
            </v-icon>
          </v-chip>
        </div>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip
          small
          :color="forslag_status[item.status].color"
          text-color="white"
        >
          {{ forslag_status[item.status].text }}
        </v-chip>
      </template>
      <template v-slot:item.opprettet="{ item }">
        {{ new Date(item.opprettet).toLocaleDateString("nb-NO", { year: 'numeric', month: 'short', day: 'numeric' }) }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import JishoDataService from "../services/JishoDataService";
import ForslagKommentarer from "../components/ForslagKommentarer";

export default {
  name: 'Forslag',
  data () {
    return {
      tab: 0,
      endre_dialog: false,
      kommentar_dialog: false,
      current_forslag: null,
      current_forslag_id: Number,
      forslag: [],
      redigert_forslag: '',
      search: '',
      alle_headers: [
        {
          text: this.$t('ord.lemma_id'),
          align: 'start',
          value: 'lemma_id',
          width: '1%'
        },
        { text: this.$t('ord.oppslagsord'), value: 'oppslag', width: '1%' },
        { text: this.$t('ord.ordklasse'), value: 'boy_tabell', width: '1%' },
        { text: this.$t('forslag.forslag_definisjon'), value: 'forslag_definisjon', width: '50%' },
        { text: this.$t('forslag.bruker'), value: 'brukernavn', width: '1%' },
        { text: this.$t('forslag.stemmer'), value: 'upvotes', width: '1%' },
        { text: this.$t('forslag.dato'), value: 'opprettet', width: '10%' },
      ],
      mine_headers: [
        {
          text: this.$t('ord.lemma_id'),
          align: 'start',
          value: 'lemma_id',
          width: '1%'
        },
        { text: this.$t('ord.oppslagsord'), value: 'oppslag', width: '1%' },
        { text: this.$t('ord.ordklasse'), value: 'boy_tabell', width: '1%' },
        { text: this.$t('forslag.forslag_definisjon'), value: 'forslag_definisjon', width: '30%' },
        { text: this.$t('forslag.stemmer'), value: 'upvotes', width: '1%' },
        { text: this.$t('forslag.status'), value: 'status', width: '1%' },
        { text: this.$t('forslag.dato'), value: 'opprettet', width: '10%' },
      ],
      forslag_status: {
        0: {
          text: this.$t('forslag.under_avstemning'),
          color: 'orange'
        },
        1: {
          text: this.$t('forslag.godkjent_avstemning'),
          color: 'green'
        },
        2: {
          text: this.$t('forslag.godkjent_admin'),
          color: 'green'
        },
        3: {
          text: this.$t('forslag.endret_godkjent'),
          color: 'green'
        },
        4: {
          text: this.$t('forslag.avvist_avstemning'),
          color: 'red'
        },
        5: {
          text: this.$t('forslag.avvist_admin'),
          color: 'red'
        }
      },
      filter_status: 0
    }
  },
  components: {
    ForslagKommentarer
  },
  watch: {
    tab: function () {
      this.refresh()
    }
  },
  computed: {
    filterFarge () {
      return statuskode => {
        if (statuskode == this.filter_status) {
          return ''
        } else {
          return ' lighten-3'
        }
      }
    },
    filtrerteForslag () {
      if (this.tab === 0) {
        return this.forslag.filter(item => item.status == this.filter_status)
      } else {
        return this.forslag.filter(item => this.$store.getters.user_id == item.user_id)
      }
    },
    currentHeaders () {
      if (this.tab === 0) {
        return this.alle_headers
      } else {
        return this.mine_headers
      }
    },
  },
  methods: {
    refresh () {
      this.search = ''
      JishoDataService.getAllForslag()
        .then(result => {
          this.forslag = result.data
          this.headers = this.alle_headers
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
          console.log(error)
        })
    },
    stemForslag (item, type) {
      JishoDataService.stemForslag(item.forslag_id, { type: type })
        .then((response) => {
          this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
          this.refresh()
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
        })
    },
    openEndreDialog (item) {
      this.endre_dialog = true
      this.current_forslag = item
      this.redigert_forslag = item.forslag_definisjon.slice()
    },
    openKommentarDialog (forslag_id) {
      this.kommentar_dialog = true
      this.current_forslag_id = forslag_id
    },
    redigerForslag (item) {

      if (this.redigert_forslag !== this.current_forslag.forslag_definisjon) {
        JishoDataService.redigerForslag(item.forslag_id, { redigert_forslag: this.redigert_forslag })
          .then((response) => {
            this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
            this.endre_dialog = false
            this.refresh()
          })
          .catch(error => {
            this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
          })
      }
      this.current_forslag = null
    },

    godkjennForslag (item) {
      this.endre_dialog = false
      const endret = this.redigert_forslag !== this.current_forslag.forslag_definisjon
      this.current_forslag = null
      JishoDataService.godkjennForslag(item.forslag_id, { redigert_forslag: this.redigert_forslag, endret: endret })
        .then((response) => {
          this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
          this.refresh()
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
        })
    },
    avvisForslag (item) {
      JishoDataService.avvisForslag(item.forslag_id)
        .then((response) => {
          this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
          this.refresh()
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
        })
    },
    fjernForslag (item) {
      JishoDataService.fjernForslag(item.forslag_id)
        .then((response) => {
          this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
          this.refresh()
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
        })
    },
    getColorUp (item) {
      if (item.minstemme === 1) {
        return 'green'
      } else {
        return 'green lighten-3'
      }
    },
    getColorDown (item) {
      if (item.minstemme === 0) {
        return 'red'
      } else {
        return 'red lighten-3'
      }
    },
    kommentarFarge (nyere) {
      if (nyere == true) {
        return 'red'
      } else {
        return 'orange'
      }
    }
  },
  mounted () {
    this.refresh()
    const forslag_id = parseInt(this.$route.params.id)
    if (forslag_id) {
      this.openKommentarDialog(forslag_id)
    }

  }
}
</script>