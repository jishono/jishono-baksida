<template>
  <v-container fluid class="pa-2 ma-0">
    <v-dialog v-model="endre_dialog" width="500" v-if="current_forslag">
      <v-card>
        <v-card-title v-if="$store.getters.isAdmin">{{
          $t("forslag.rediger_godkjenn")
        }}</v-card-title>
        <v-card-title v-else>{{ $t("forslag.rediger_forslag") }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="redigert_forslag"
            counter
            maxlength="100"
            variant="outlined"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="endre_dialog = false">
            {{ $t("knapper.avbryt") }}
          </v-btn>
          <v-btn
            v-if="$store.getters.user_id == current_forslag.user_id"
            color="green"
            @click="redigerForslag(current_forslag)"
          >
            {{ $t("knapper.oppdater") }}
          </v-btn>
          <v-btn
            v-if="$store.getters.isAdmin"
            color="green"
            @click="godkjennForslag(current_forslag)"
          >
            {{ $t("knapper.godkjenn") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="kommentar_dialog"
      width="500"
      @click:outside="closeKommentarDialog"
    >
      <forslag-kommentarer
        v-bind:forslag_id="this.current_forslag_id"
        @close="closeKommentarDialog"
      ></forslag-kommentarer>
    </v-dialog>
    <v-tabs centered v-model="tab" class="mb-2">
      <v-tab>
        {{ $t("forslag.alle") }}
      </v-tab>
      <v-tab>
        {{ $t("forslag.mine") }}
      </v-tab>
      <v-tab @click="handleWordlistTabClick">
        {{ $t("ord.oppslag") }}
      </v-tab>
    </v-tabs>
    <v-row no-gutters v-if="tab == 0">
      <v-col align="center">
        <span
          v-for="(statuskode, index) in forslag_status"
          :key="statuskode.text"
        >
          <v-chip
            class="mt-3 mx-2"
            size="small"
            :color="statuskode.color"
            :variant="filter_status != index ? 'outlined' : 'flat'"
            @click="
              filter_status = index;
              page = 1;
            "
          >
            {{ $t(statuskode.text) }}
          </v-chip>
        </span>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col align="center">
        <v-chip
          class="mt-3 mx-2"
          size="small"
          color="primary"
          :variant="!filtrer_uleste ? 'outlined' : 'flat'"
          @click="filtrer_uleste = filtrer_uleste ? false : true"
        >
          <v-icon size="small" v-if="filtrer_uleste" start
            >mdi-checkbox-marked-circle</v-icon
          >
          <v-icon size="small" v-else start
            >mdi-checkbox-blank-circle-outline</v-icon
          >
          {{ $t("forslag.uleste_kommentarer") }}
        </v-chip>
        <v-chip
          class="mt-3 mx-2"
          size="small"
          color="primary"
          :variant="!filtrer_ikke_stemt ? 'outlined' : 'flat'"
          @click="filtrer_ikke_stemt = filtrer_ikke_stemt ? false : true"
        >
          <v-icon size="small" v-if="filtrer_ikke_stemt" start
            >mdi-checkbox-marked-circle</v-icon
          >
          <v-icon size="small" v-else start
            >mdi-checkbox-blank-circle-outline</v-icon
          >
          {{ $t("forslag.ikke_stemt") }}
        </v-chip>
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
      v-model:page="page"
      :items-per-page="20"
      :sort-by="
        filter_status === 0
          ? [{ key: 'opprettet', order: 'desc' }]
          : [{ key: 'godkjent_avvist', order: 'desc' }]
      "
      class="elevation-1"
      mobile-breakpoint="1030"
    >
      <template v-slot:[`item.lemma_id`]="{ item }">
        <div style="width: 60px">
          <router-link
            v-if="$store.getters.isAdmin"
            :to="{ path: 'endre/' + item.lemma_id }"
            >{{ item.lemma_id }}</router-link
          >
          <span v-else>{{ item.lemma_id }}</span>
        </div>
      </template>
      <template v-slot:[`item.oppslag`]="{ item }">
        <router-link
          v-if="$store.getters.isLoggedIn"
          :to="{ path: 'nytt_forslag/' + item.lemma_id }"
          :title="$t('forslag.nytt_forslag_oppslag')"
          >{{ item.oppslag }}</router-link
        >
        <span v-else>{{ item.oppslag }}</span>
        <v-tooltip
          location="bottom"
          v-if="item.eksisterende_definisjoner && item.status == 0"
        >
          <template v-slot:activator="{ props }">
            <v-icon color="red" size="small" class="ml-1" v-bind="props">
              mdi-alert-circle
            </v-icon>
          </template>
          <span>{{ $t("forslag.eksisterende_definisjoner_varsel") }}</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.forslag_definisjon`]="{ item }">
        <span v-html="addFurigana(item.forslag_definisjon)"></span>
        <span class="text-caption text-medium-emphasis ml-1" v-if="item.endret == true"
          >({{ $t("veggen.endret") }})</span
        >
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div class="d-flex align-center" style="white-space: nowrap; gap: 2px">
          <v-btn
            v-if="$store.getters.isAdmin && item.status == 0"
            variant="plain"
            density="compact"
            color="green"
            class="pa-0"
            style="min-width: 0"
            @click="openEndreDialog(item)"
          >
            <v-icon size="22">mdi-check-circle-outline</v-icon>
          </v-btn>
          <v-btn
            v-if="$store.getters.isAdmin && item.status == 0"
            variant="plain"
            density="compact"
            color="red"
            class="pa-0"
            style="min-width: 0"
            @click="avvisForslag(item)"
          >
            <v-icon size="22">mdi-close-box</v-icon>
          </v-btn>
          <v-btn
            v-if="item.user_id == $store.getters.user_id && item.status == 0"
            variant="plain"
            density="compact"
            color="orange-darken-1"
            class="pa-0"
            style="min-width: 0"
            @click="openEndreDialog(item)"
          >
            <v-icon size="22">mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn
            v-if="item.user_id == $store.getters.user_id && item.status == 0"
            variant="plain"
            density="compact"
            color="red-lighten-1"
            class="pa-0"
            style="min-width: 0"
            @click="fjernForslag(item)"
          >
            <v-icon size="22">mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>
      <template v-slot:[`item.upvotes`]="{ item }">
        <div class="" style="width: 175px">
          <v-chip
            :color="getColorUp(item)"
            variant="flat"
            class="mr-1 px-2"
            :disabled="filter_status != 0"
            size="small"
            @click="stemForslag(item, 1)"
          >
            <span class="ml-1 mr-2">
              {{ item.upvotes }}
            </span>
            <v-icon size="small"> mdi-thumb-up-outline </v-icon>
          </v-chip>
          <v-chip
            variant="flat"
            class="mr-1 px-2"
            :color="getColorDown(item)"
            :disabled="filter_status != 0"
            size="small"
            @click="stemForslag(item, 0)"
          >
            <span class="ml-1 mr-2">
              {{ item.downvotes }}
            </span>
            <v-icon size="small"> mdi-thumb-down-outline </v-icon>
          </v-chip>
          <v-chip
            variant="flat"
            class="mr-1 px-2"
            :color="kommentarFarge(item.sett)"
            size="small"
            @click="openKommentarDialog(item.forslag_id)"
          >
            <span class="ml-1 mr-2">
              {{ item.antall_kommentarer }}
            </span>

            <v-icon size="small"> mdi-comment-text-outline </v-icon>
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-chip size="small" :color="forslag_status[item.status].color">
          {{ $t(forslag_status[item.status].text) }}
        </v-chip>
      </template>
      <template v-slot:[`item.opprettet`]="{ item }">
        <span v-if="item.status === 0">{{
          new Date(item.opprettet).toLocaleDateString("nb-NO", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        }}</span>
        <span v-else>{{
          new Date(item.godkjent_avvist).toLocaleDateString("nb-NO", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        }}</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";

import ForslagKommentarer from "../components/ForslagKommentarer.vue";
import helpers from "../mixins/helpers";
import JishoDataService from "../services/JishoDataService";

export default defineComponent({
  name: "Forslag",
  mixins: [helpers],

  data() {
    return {
      tab: 0,
      page: 1,
      endre_dialog: false,
      kommentar_dialog: false,
      current_forslag: null,
      current_forslag_id: Number,
      forslag: [],
      redigert_forslag: "",
      search: "",
      filtrer_uleste: false,
      filtrer_ikke_stemt: false,
      alle_headers: [
        {
          title: this.$t("ord.lemma_id"),
          align: "start",
          key: "lemma_id",
          width: "1%",
        },
        { title: this.$t("ord.oppslagsord"), key: "oppslag", width: "1%" },
        { title: this.$t("ord.ordklasse"), key: "boy_tabell", width: "1%" },
        {
          title: this.$t("forslag.forslag_definisjon"),
          key: "forslag_definisjon",
          width: "50%",
        },
        { title: this.$t("forslag.bruker"), key: "brukernavn", width: "1%" },
        { title: this.$t("forslag.stemmer"), key: "upvotes", width: "1%" },
        { title: this.$t("forslag.dato"), key: "opprettet", width: "10%" },
        { title: "Handlinger", key: "actions", sortable: false, width: "1%" },
      ],
      mine_headers: [
        {
          title: this.$t("ord.lemma_id"),
          align: "start",
          key: "lemma_id",
          width: "1%",
        },
        { title: this.$t("ord.oppslagsord"), key: "oppslag", width: "1%" },
        { title: this.$t("ord.ordklasse"), key: "boy_tabell", width: "1%" },
        {
          title: this.$t("forslag.forslag_definisjon"),
          key: "forslag_definisjon",
          width: "30%",
        },
        { title: this.$t("forslag.stemmer"), key: "upvotes", width: "1%" },
        { title: this.$t("forslag.status"), key: "status", width: "1%" },
        { title: this.$t("forslag.lagt_til"), key: "opprettet", width: "10%" },
        { title: "Handlinger", key: "actions", sortable: false, width: "1%" },
      ],
      forslag_status: [
        {
          text: "forslag.under_avstemning",
          color: "orange",
        },
        {
          text: "forslag.godkjent_avstemning",
          color: "green-lighten-1",
        },
        {
          text: "forslag.godkjent_admin",
          color: "green-lighten-1",
        },
        {
          text: "forslag.endret_godkjent",
          color: "green-lighten-1",
        },
        {
          text: "forslag.avvist_avstemning",
          color: "red-lighten-1",
        },
        {
          text: "forslag.avvist_admin",
          color: "red-lighten-1",
        },
      ],
      filter_status: 0,
    };
  },

  components: {
    ForslagKommentarer,
  },

  watch: {
    tab: function (tabValue) {
      if (tabValue === 0) {
        this.filter_status = 0;
        this.refresh(0);
      } else {
        this.getMyForslag();
      }
    },
    filter_status: function (status) {
      console.log("test");
      this.refresh(status);
    },
  },

  computed: {
    filtrerteForslag() {
      let filtrerte = this.forslag;
      const user_id = this.$store.getters.user_id;

      if (this.filtrer_uleste) {
        filtrerte = filtrerte.filter((item) => item.sett == 0);
      }
      if (this.filtrer_ikke_stemt) {
        filtrerte = filtrerte.filter(
          (item) => item.minstemme == null && item.user_id != user_id,
        );
      }
      return filtrerte;
    },

    currentHeaders() {
      if (this.tab === 0) {
        return this.alle_headers;
      } else {
        return this.mine_headers;
      }
    },
  },

  methods: {
    refresh(status = 0) {
      JishoDataService.getAllForslag(status)
        .then((result) => {
          this.forslag = result.data;
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
          console.log(error);
        });
    },
    getMyForslag() {
      const user_id = this.$store.getters.user_id;
      JishoDataService.getMyForslag(user_id)
        .then((result) => {
          this.forslag = result.data;
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
          console.log(error);
        });
    },
    stemForslag(item, type) {
      JishoDataService.stemForslag(item.forslag_id, { type: type })
        .then((response) => {
          this.$store.dispatch("show_snackbar", {
            message: response.data,
            color: "success",
          });
          this.refresh();
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    openEndreDialog(item) {
      this.endre_dialog = true;
      this.current_forslag = item;
      this.redigert_forslag = item.forslag_definisjon.slice();
    },
    openKommentarDialog(forslag_id) {
      this.kommentar_dialog = true;
      this.current_forslag_id = forslag_id;
    },
    closeKommentarDialog() {
      this.kommentar_dialog = false;
      this.current_forslag_id = null;
      this.refresh(this.filter_status);
    },
    handleWordlistTabClick() {
      this.$router.push("/oppslag_forslag");
    },
    redigerForslag(item) {
      if (this.redigert_forslag !== this.current_forslag.forslag_definisjon) {
        JishoDataService.redigerForslag(item.forslag_id, {
          redigert_forslag: this.redigert_forslag,
        })
          .then((response) => {
            this.$store.dispatch("show_snackbar", {
              message: response.data,
              color: "success",
            });
            this.endre_dialog = false;
            this.refresh();
          })
          .catch((error) => {
            this.$store.dispatch("show_snackbar", {
              message: error.response.data,
              color: "error",
            });
          });
      }
      this.current_forslag = null;
    },

    godkjennForslag(item) {
      this.endre_dialog = false;
      const endret =
        this.redigert_forslag !== this.current_forslag.forslag_definisjon;
      this.current_forslag = null;
      JishoDataService.godkjennForslag(item.forslag_id, {
        redigert_forslag: this.redigert_forslag,
        endret: endret,
      })
        .then((response) => {
          this.$store.dispatch("show_snackbar", {
            message: response.data,
            color: "success",
          });
          this.refresh();
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    avvisForslag(item) {
      JishoDataService.avvisForslag(item.forslag_id)
        .then((response) => {
          this.$store.dispatch("show_snackbar", {
            message: response.data,
            color: "success",
          });
          this.refresh();
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    fjernForslag(item) {
      JishoDataService.fjernForslag(item.forslag_id)
        .then((response) => {
          this.$store.dispatch("show_snackbar", {
            message: response.data,
            color: "success",
          });
          this.refresh();
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    getColorUp(item) {
      if (item.minstemme === 1) {
        return "green";
      } else {
        return "green-lighten-3";
      }
    },
    getColorDown(item) {
      if (item.minstemme === 0) {
        return "red";
      } else {
        return "red-lighten-3";
      }
    },
    kommentarFarge(sett) {
      if (sett == true) {
        return "orange";
      } else {
        return "red";
      }
    },
  },

  mounted() {
    this.refresh();
    const forslag_id = parseInt(this.$route.params.id);
    if (forslag_id) {
      this.openKommentarDialog(forslag_id);
    }
  },
});
</script>
