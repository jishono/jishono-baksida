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
        <v-card-title v-if="$store.getters.isAdmin">Redigerer og godkjenn forslag</v-card-title>
        <v-card-title v-else>Rediger forslag</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="redigert_forslag"
            counter
            maxlength="100"
            outlined
          ></v-text-field>
          OBS. Hvis du endrer forslaget blir alle stemmer nullstilt.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            dark
            @click="endre_dialog = false"
          >
            Avbryt
          </v-btn>
          <v-btn
            color="green"
            dark
            @click="redigerForslag(current_forslag)"
          >
            Oppdater
          </v-btn>
          <v-btn
            v-if="$store.getters.isAdmin"
            color="green"
            dark
            @click="godkjennForslag(current_forslag)"
          >
            Godkjenn
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="kommentar_dialog"
      width="500"
    >
      <forslag-kommentarer
        v-bind:forslag="this.current_forslag"
        @close="kommentar_dialog = false; refresh()"
      ></forslag-kommentarer>

    </v-dialog>
    <v-tabs
      centered
      v-model="tab"
      class="mb-2"
    >
      <v-tab>
        Alle
      </v-tab>
      <v-tab>
        Mine
      </v-tab>
    </v-tabs>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Søk"
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :search="search"
      :items="forslag"
      :footer-props="{
                      'items-per-page-options': [5, 10, 20, 30, 40, 50]
                       }"
      :items-per-page="20"
      sort-by="opprettet"
      :sort-desc="true"
      class="elevation-1"
    >
      <template v-slot:item.lemma_id="{ item }">

        <router-link
          v-if="$store.getters.isAdmin"
          :to="{path: 'endre/' + item.lemma_id}"
        >{{ item.lemma_id}}</router-link>
        <span v-else>{{ item.lemma_id }}</span>
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
      <template v-slot:item.stemmer="{ item }">
        <v-chip
          :color="getColorUp(item)"
          class="mr-1"
          text-color="white"
          small
          @click="stemForslag(item, 1)"
        >
          <span class="mr-2">
            {{ item.upvotes}}
          </span>
          <v-icon
            small
            dark
          >
            mdi-thumb-up-outline
          </v-icon>
        </v-chip>
        <v-chip
          class="mr-1"
          :color="getColorDown(item)"
          text-color="white"
          small
          @click="stemForslag(item, 0)"
        >
          <span class="mr-2">
            {{ item.downvotes}}
          </span>
          <v-icon
            small
            dark
          >
            mdi-thumb-down-outline
          </v-icon>
        </v-chip>
        <v-chip
          class="mr-1"
          color="orange"
          text-color="white"
          small
          @click="openKommentarDialog(item)"
        >
          <span class="mr-2">
            {{ item.antall_kommentarer}}
          </span>
          <v-icon
            small
            dark
          >
            mdi-comment-text-outline
          </v-icon>
        </v-chip>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip
          small
          :color="$store.getters.status_color(item.status)"
          text-color="white"
        >
          {{ $store.getters.status_text(item.status)}}
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
      redigert_forslag: '',
      search: '',
      headers: [],
      alle_headers: [

        {
          text: 'Lemma-ID',
          align: 'start',
          value: 'lemma_id',
          width: '1%'
        },
        { text: 'Oppslagsord', value: 'oppslag', width: '1%' },
        { text: 'Ordklasse', value: 'boy_tabell', width: '1%' },
        { text: 'Forslag til definisjon', value: 'forslag_definisjon', width: '30%' },
        { text: 'Oversatt av', value: 'brukernavn', width: '1%' },
        { text: 'Stemmer', value: 'stemmer', width: '20%' },
        { text: 'Dato', value: 'opprettet', width: '15%' },
      ],
      mine_headers: [
        {
          text: 'Lemma-ID',
          align: 'start',
          value: 'lemma_id',
          width: '1%'
        },
        { text: 'Oppslagsord', value: 'oppslag', width: '1%' },
        { text: 'Ordklasse', value: 'boy_tabell', width: '1%' },
        { text: 'Forslag til definisjon', value: 'forslag_definisjon', width: '30%' },
        { text: 'Stemmer', value: 'stemmer', width: '20%' },
        { text: 'Status', value: 'status', width: '1%' },
        { text: 'Dato', value: 'opprettet', width: '10%' },
      ],
      forslag: [],
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
  methods: {
    refresh () {
      this.search = ''
      if (this.tab === 0) {
        JishoDataService.getAllForslag()
          .then(result => {
            this.forslag = result.data
            this.headers = this.alle_headers
          })
      } else if (this.tab === 1) {
        const user_id = this.$store.getters.user_id
        JishoDataService.getBrukerforslag(user_id)
          .then(res => {
            this.forslag = res.data
            this.headers = this.mine_headers
          })
          .catch(error => {
            console.log(error)
          })
      }
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
    openKommentarDialog (item) {
      this.kommentar_dialog = true
      this.current_forslag = item
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
    setSnackbar (message, color) {
      this.snackbarMessage = message
      this.snackbarColor = color
      this.snackbar = true
    }
  },
  mounted () {
    this.refresh()
  }
}
</script>