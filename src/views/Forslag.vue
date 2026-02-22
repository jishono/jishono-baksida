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
      :items="filtrerteForslag"
      v-model:page="page"
      :items-per-page="20"
      :sort-by="[{ key: 'siste_opprettet', order: 'desc' }]"
      hover
      @click:row="(e, { item }) => openEndreDialog(item.forslag[0])"
      class="elevation-1"
      mobile-breakpoint="1030"
    >
      <template v-slot:[`item.lemma_id`]="{ item }">
        <div style="width: 60px">
          <router-link
            v-if="$store.getters.isAdmin"
            :to="{ path: 'endre/' + item.lemma_id }"
            @click.stop
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
          @click.stop
          >{{ item.oppslag }}</router-link
        >
        <span v-else>{{ item.oppslag }}</span>
        <v-tooltip
          location="bottom"
          v-if="
            item.definisjoner.length > 0 &&
            item.forslag.some((f) => f.status == 0)
          "
        >
          <template v-slot:activator="{ props }">
            <v-icon color="red" size="small" class="ml-1" v-bind="props">
              mdi-alert-circle
            </v-icon>
          </template>
          <span>{{ $t("forslag.eksisterende_definisjoner_varsel") }}</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.definisjoner_og_forslag`]="{ item }">
        <div
          v-for="(d, i) in item.definisjoner"
          :key="'def-' + i"
          class="text-green-darken-2 py-1"
        >
          <span class="text-caption font-weight-bold mr-1">{{ i + 1 }}.</span>{{ d.definisjon || d }}
        </div>
        <div
          v-for="(f, j) in item.forslag"
          :key="f.forslag_id"
          class="text-error py-1"
          style="cursor: pointer"
          @click.stop="openEndreDialog(f)"
        >
          <span class="text-caption font-weight-bold mr-1">{{ item.definisjoner.length + j + 1 }}.</span><span v-html="addFurigana(f.forslag_definisjon)"></span>
          <span
            class="text-caption text-medium-emphasis ml-1"
            v-if="f.endret == true"
            >({{ $t("veggen.endret") }})</span
          >
        </div>
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
          key: "definisjoner_og_forslag",
          sortable: false,
          width: "70%",
        },
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
          key: "definisjoner_og_forslag",
          sortable: false,
          width: "70%",
        },
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
      const user_id = this.$store.getters.user_id;
      const searchLower = this.search.toLowerCase().trim();

      return this.forslag
        .map((lemma) => {
          let fs = lemma.forslag;
          if (this.filtrer_uleste) {
            fs = fs.filter((f) => f.sett == 0);
          }
          if (this.filtrer_ikke_stemt) {
            fs = fs.filter((f) => f.minstemme == null && f.user_id != user_id);
          }
          if (searchLower) {
            const matchesOppslag = lemma.oppslag
              .toLowerCase()
              .includes(searchLower);
            if (!matchesOppslag) {
              fs = fs.filter((f) =>
                f.forslag_definisjon.toLowerCase().includes(searchLower),
              );
            }
          }
          const siste_opprettet = fs.reduce(
            (max, f) => (f.opprettet > max ? f.opprettet : max),
            "",
          );
          return { ...lemma, forslag: fs, siste_opprettet };
        })
        .filter((lemma) => lemma.forslag.length > 0);
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
