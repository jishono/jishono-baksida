<template>
  <div v-if="currentOppslag" class="pa-0">
    <Boyningstabell
      v-if="$store.getters.boy_ok.includes(currentOppslag.boy_tabell)"
      v-bind:lemma_id="currentOppslag.lemma_id"
      v-model:boyningsDialog="boyningsDialog"
      @outside_click="boyningsDialog = false"
    />
    <v-card
      width="500"
      class="mx-auto"
      :style="isDialog ? 'max-height: 90vh; overflow-y: auto' : ''"
    >
      <v-card-title class="pb-0">
        <div class="d-flex justify-end" style="min-height: 24px">
          <v-icon
            v-if="isDialog"
            @click="$emit('close')"
            style="cursor: pointer"
            >mdi-close</v-icon
          >
        </div>
        <div class="text-h3">{{ currentOppslag.oppslag }}</div>
        <div class="text-body-2 text-medium-emphasis mt-1">
          {{ currentOppslag.boy_tabell }} · #{{ currentOppslag.lemma_id }}
        </div>
        <div class="d-flex flex-wrap mt-2" style="gap: 4px">
          <v-btn
            color="primary"
            :href="
              'https://ordbok.uib.no/perl/ordbok.cgi?OPP=' +
              currentOppslag.oppslag +
              '&bokmaal=+'
            "
            target="_blank"
            variant="outlined"
            size="small"
          >
            <v-icon start>mdi-open-in-new</v-icon>BMO
          </v-btn>
          <v-btn
            color="primary"
            :href="'https://naob.no/s%C3%B8k/' + currentOppslag.oppslag"
            target="_blank"
            variant="outlined"
            size="small"
          >
            <v-icon start>mdi-open-in-new</v-icon>NAOB
          </v-btn>
          <v-dialog v-model="instruksDialog" width="800">
            <template v-slot:activator="{ props }">
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                v-bind="props"
              >
                {{ $t("knapper.instruks") }}
              </v-btn>
            </template>
            <v-card>
              <div class="d-flex justify-end pa-2 pb-0">
                <v-icon @click="instruksDialog = false" style="cursor: pointer">mdi-close</v-icon>
              </div>
              <v-card-text class="pt-0">
                <InstruksBoks />
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            @click="boyningsDialog = true"
          >
            {{ $t("knapper.boyning") }}
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="mt-4">
          <v-divider class="mt-6 mb-2" />
          <div class="text-overline text-medium-emphasis mb-2">
            {{ $t("forslag.eksisterende_definisjoner") }}
          </div>
          <div
            v-for="(def, index) in currentOppslag.definisjon"
            v-bind:key="index"
            class="definisjon-rad d-flex align-baseline mb-1 py-1 pl-3"
          >
            <span class="text-medium-emphasis font-weight-bold mr-2" style="font-size: 1.15rem">{{ maruSuji(index + 1) }}</span>
            <span style="font-size: 1.15rem; line-height: 1.6" class="flex-grow-1">{{ def.definisjon }}</span>
            <v-btn
              variant="plain"
              density="compact"
              color="orange-darken-1"
              class="pa-0 ml-1"
              style="min-width: 0"
              @click="startErstatt(def, index)"
            >
              <v-icon size="20">mdi-swap-horizontal</v-icon>
            </v-btn>
          </div>
          <v-divider class="mt-6 mb-2" />
          <div class="text-overline text-medium-emphasis mb-2">
            {{ $t("forslag.forslag") }}
          </div>
          <div
            v-for="(f, j) in (currentOppslag.forslag ?? []).filter(f => f.status === 0)"
            :key="f.forslag_id"
          >
            <div class="forslag-rad d-flex align-center justify-space-between mb-1 py-1">
              <div class="d-flex align-center flex-wrap">
                <span class="text-medium-emphasis font-weight-bold mr-2" style="font-size: 1.15rem">{{ f.replaces_def_id ? maruSuji(getDefIndex(f.replaces_def_id) + 1) : (currentOppslag.definisjon.length + nyForslagIndex(j) + 1 + '.') }}</span>
                <template v-if="f.replaces_def_id">
                  <span style="font-size: 1.05rem; text-decoration: line-through; opacity: 0.5" class="mr-2">{{ getDefText(f.replaces_def_id) }}</span>
                  <v-icon size="16" class="mr-2 text-medium-emphasis">mdi-arrow-right</v-icon>
                </template>
                <span style="font-size: 1.15rem; line-height: 1.6" v-html="addFurigana(f.forslag_definisjon)"></span>
                <v-chip v-if="f.endret" size="x-small" variant="flat" color="orange-darken-2" class="ml-2 text-white">{{ $t("veggen.endret") }}</v-chip>
              </div>
              <div class="d-flex align-center" style="gap: 4px">
                <v-tooltip :text="f.brukernavn" location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" size="20" color="grey" class="mr-1">mdi-account-circle-outline</v-icon>
                  </template>
                </v-tooltip>
                <v-chip
                  :color="getColorUp(f)"
                  variant="flat"
                  size="small"
                  class="px-2"
                  :disabled="f.status != 0"
                  @click.stop="stemForslag(f, 1)"
                >
                  <span class="mr-1">{{ f.upvotes }}</span>
                  <v-icon size="small">mdi-thumb-up-outline</v-icon>
                </v-chip>
                <v-chip
                  :color="getColorDown(f)"
                  variant="flat"
                  size="small"
                  class="px-2"
                  :disabled="f.status != 0"
                  @click.stop="stemForslag(f, 0)"
                >
                  <span class="mr-1">{{ f.downvotes }}</span>
                  <v-icon size="small">mdi-thumb-down-outline</v-icon>
                </v-chip>
                <template v-if="f.status == 0">
                  <v-btn
                    v-if="$store.getters.isAdmin"
                    variant="plain"
                    density="compact"
                    color="green"
                    class="pa-0"
                    style="min-width: 0"
                    @click="openEdit(f)"
                  >
                    <v-icon size="22">mdi-check-circle-outline</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="$store.getters.isAdmin"
                    variant="plain"
                    density="compact"
                    color="red"
                    class="pa-0"
                    style="min-width: 0"
                    @click="avvisForslag(f)"
                  >
                    <v-icon size="22">mdi-close-box</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="$store.getters.user_id == f.user_id"
                    variant="plain"
                    density="compact"
                    color="orange-darken-1"
                    class="pa-0"
                    style="min-width: 0"
                    @click="openEdit(f)"
                  >
                    <v-icon size="22">mdi-pencil-outline</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="$store.getters.user_id == f.user_id"
                    variant="plain"
                    density="compact"
                    color="red-lighten-1"
                    class="pa-0"
                    style="min-width: 0"
                    @click="fjernForslag(f)"
                  >
                    <v-icon size="22">mdi-delete</v-icon>
                  </v-btn>
                </template>
              </div>
            </div>
            <div v-if="editing_forslag_id === f.forslag_id" class="mb-2">
              <v-text-field
                v-model="redigert_forslag"
                counter
                maxlength="100"
                variant="outlined"
                density="compact"
              ></v-text-field>
              <div class="d-flex justify-end" style="gap: 6px">
                <v-btn size="small" color="red" @click="cancelEdit">{{
                  $t("knapper.avbryt")
                }}</v-btn>
                <v-btn
                  v-if="$store.getters.user_id == f.user_id"
                  size="small"
                  color="green"
                  @click="redigerForslag(f)"
                  >{{ $t("knapper.oppdater") }}</v-btn
                >
                <v-btn
                  v-if="$store.getters.isAdmin"
                  size="small"
                  color="green"
                  @click="godkjennForslag(f)"
                  >{{ $t("knapper.godkjenn") }}</v-btn
                >
              </div>
            </div>
          </div>

          <div v-if="erstatter_def" class="mt-6 erstatt-boks pa-3 rounded">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-overline text-medium-emphasis">{{ $t("forslag.erstatt_definisjon") }}</span>
              <v-btn variant="plain" density="compact" class="pa-0" style="min-width: 0" @click="avbrytErstatt">
                <v-icon size="20">mdi-close</v-icon>
              </v-btn>
            </div>
            <div class="mb-3 pl-3" style="border-left: 3px solid #ef5350">
              <span class="text-medium-emphasis font-weight-bold mr-2" style="font-size: 1.15rem">{{ maruSuji(erstatter_def._index + 1) }}</span>
              <span style="font-size: 1.15rem; text-decoration: line-through; opacity: 0.6">{{ erstatter_def.definisjon }}</span>
            </div>
            <v-text-field
              v-model="nye_forslag[0]['definisjon']"
              counter
              maxlength="100"
              variant="outlined"
            >
              <template v-slot:label>
                {{ maruSuji(erstatter_def._index + 1) }}
                {{ $t("forslag.forslag_definisjon") }}
              </template>
              <template v-slot:append>
                <v-btn
                  color="green"
                  size="small"
                  variant="outlined"
                  @click="addForslag"
                >
                  {{ $t("knapper.foreslå") }}
                </v-btn>
              </template>
            </v-text-field>
          </div>

          <div class="mt-6"
            v-for="(ny_def, index2) in nye_forslag"
            v-bind:key="index2 + 100"
            v-show="!erstatter_def"
          >
            <v-text-field
              v-model="nye_forslag[index2]['definisjon']"
              counter
              maxlength="100"
              variant="outlined"
            >
              <template v-slot:label>
                {{
                  maruSuji(
                    currentOppslag.definisjon.length +
                      (currentOppslag.forslag?.filter(f => f.status === 0 && !f.replaces_def_id).length ?? 0) +
                      index2 +
                      1,
                  )
                }}
                {{ $t("forslag.forslag_definisjon") }}
              </template>
              <template v-slot:append>
                <v-btn
                  color="green"
                  size="small"
                  variant="outlined"
                  @click="addForslag"
                >
                  {{ $t("knapper.foreslå") }}
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </div>

        <div class="mt-4 mb-2">
          <span class="text-h6">{{ $t("kommentar.kommentarer") }}</span>
        </div>
        <v-textarea
          variant="outlined"
          :label="$t('kommentar.ny_kommentar')"
          v-model="ny_kommentar"
          rows="4"
        ></v-textarea>
        <div class="d-flex justify-end">
          <v-btn color="green" size="small" @click="postKommentar">
            {{ $t("kommentar.post_kommentar") }}
          </v-btn>
        </div>
        <div v-if="kommentarer.length" class="mt-8">
          <div v-for="kom in kommentarer" :key="kom.lemma_kommentar_id">
            <v-card class="mb-4">
              <v-card-title
                class="headline bg-orange-lighten-3 text-body-2 pa-3 d-flex align-center"
              >
                <v-avatar :color="randomFarge(kom.brukernavn)" size="32">
                  <span class="text-white">{{
                    initialer(kom.brukernavn)
                  }}</span>
                </v-avatar>
                <span class="font-weight-black ml-2">{{ kom.brukernavn }}</span>
                <v-spacer></v-spacer>
                <span class="text-medium-emphasis">{{
                  new Date(kom.opprettet).toLocaleString("da-DK")
                }}</span>
              </v-card-title>
              <v-card-text class="pa-3">
                <vue-markdown
                  class="linjeskift"
                  :source="kom.kommentar"
                  :plugins="[markdownItEmoji]"
                ></vue-markdown>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import { full as markdownItEmoji } from "markdown-it-emoji";
import VueMarkdown from "vue-markdown-render";
import Boyningstabell from "../components/Boyningstabell.vue";
import InstruksBoks from "../components/InstruksBoks.vue";
import helpers from "../mixins/helpers";
import JishoDataService from "../services/JishoDataService";

export default defineComponent({
  name: "nytt-forslag",
  emits: ["close", "refresh"],
  mixins: [helpers],

  props: {
    lemma_id: { type: Number, default: null },
  },

  computed: {
    isDialog() {
      return this.lemma_id != null;
    },
    oppslagId() {
      return this.lemma_id || this.$route.params.id;
    },
  },

  watch: {
    lemma_id(newVal) {
      if (!newVal) return;
      this.ny_kommentar = "";
      this.nye_forslag = [{ definisjon: "", prioritet: null }];
      this.editing_forslag_id = null;
      this.redigert_forslag = "";
      this.erstatter_def = null;
      this.getOppslag(newVal);
    },
  },

  data() {
    return {
      currentOppslag: null,
      nye_forslag: [{ definisjon: "", prioritet: null }],
      boyningsDialog: false,
      instruksDialog: false,
      ny_kommentar: "",
      kommentarer: [],
      markdownItEmoji,
      editing_forslag_id: null,
      redigert_forslag: "",
      erstatter_def: null,
    };
  },

  components: {
    Boyningstabell,
    InstruksBoks,
    VueMarkdown,
  },

  methods: {
    getOppslag(id) {
      JishoDataService.get(id)
        .then((response) => {
          this.currentOppslag = response.data;
          this.hentKommentarer();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    hentKommentarer() {
      JishoDataService.getForslagKommentarer(this.currentOppslag.lemma_id)
        .then((response) => {
          this.kommentarer = response.data;
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    postKommentar() {
      if (this.ny_kommentar !== "") {
        JishoDataService.postForslagKommentar(this.currentOppslag.lemma_id, {
          ny_kommentar: this.ny_kommentar,
        })
          .then((response) => {
            this.$store.dispatch("show_snackbar", {
              message: response.data,
              color: "success",
            });
            this.ny_kommentar = "";
            this.hentKommentarer();
          })
          .catch((error) => {
            this.$store.dispatch("show_snackbar", {
              message: error.response.data,
              color: "error",
            });
            this.ny_kommentar = "";
            this.hentKommentarer();
          });
      }
    },
    nyForslagIndex(j) {
      const pending = (this.currentOppslag.forslag ?? []).filter(f => f.status === 0);
      let count = 0;
      for (let i = 0; i < j; i++) {
        if (!pending[i].replaces_def_id) count++;
      }
      return count;
    },
    getDefIndex(def_id) {
      return this.currentOppslag.definisjon.findIndex(d => d.def_id === def_id);
    },
    getDefText(def_id) {
      const def = this.currentOppslag.definisjon.find(d => d.def_id === def_id);
      return def ? def.definisjon : '';
    },
    startErstatt(def, index) {
      this.erstatter_def = { ...def, _index: index };
      this.nye_forslag = [{ definisjon: "", prioritet: null }];
    },
    avbrytErstatt() {
      this.erstatter_def = null;
      this.nye_forslag = [{ definisjon: "", prioritet: null }];
    },
    addForslag() {
      this.checkEmpty();
      const nDef = this.currentOppslag.definisjon.length;
      const nForslag = (this.currentOppslag.forslag || []).filter(f => f.status === 0 && !f.replaces_def_id).length;
      for (let i = 0; i < this.nye_forslag.length; i++) {
        if (this.erstatter_def) {
          this.nye_forslag[i].prioritet = this.erstatter_def._index + 1;
          this.nye_forslag[i].replaces_def_id = this.erstatter_def.def_id;
        } else {
          this.nye_forslag[i].prioritet = nDef + nForslag + i + 1;
        }
      }
      JishoDataService.addForslag(this.currentOppslag.lemma_id, {
        nye_forslag: this.nye_forslag,
        lemma_id: this.currentOppslag.lemma_id,
      })
        .then((response) => {
          this.$store.dispatch("show_snackbar", {
            message: response.data,
            color: "success",
          });
          this.$emit("refresh");
          this.erstatter_def = null;
          this.nye_forslag = [
            { definisjon: "", prioritet: null },
          ];
          this.getOppslag(this.oppslagId);
          if (!this.isDialog) {
            setTimeout(() => this.$router.push("/forslag"), 2000);
          }
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
          console.log(error);
        });
    },
    openEdit(f) {
      this.editing_forslag_id = f.forslag_id;
      this.redigert_forslag = f.forslag_definisjon;
    },
    cancelEdit() {
      this.editing_forslag_id = null;
      this.redigert_forslag = "";
    },
    stemForslag(f, type) {
      JishoDataService.stemForslag(f.forslag_id, { type })
        .then(() => {
          this.getOppslag(this.oppslagId);
          this.$emit("refresh");
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    redigerForslag(f) {
      if (this.redigert_forslag !== f.forslag_definisjon) {
        JishoDataService.redigerForslag(f.forslag_id, {
          redigert_forslag: this.redigert_forslag,
        })
          .then((response) => {
            this.$store.dispatch("show_snackbar", {
              message: response.data,
              color: "success",
            });
            this.cancelEdit();
            this.getOppslag(this.oppslagId);
            this.$emit("refresh");
          })
          .catch((error) => {
            this.$store.dispatch("show_snackbar", {
              message: error.response.data,
              color: "error",
            });
          });
      } else {
        this.cancelEdit();
      }
    },
    godkjennForslag(f) {
      const endret = this.redigert_forslag !== f.forslag_definisjon;
      JishoDataService.godkjennForslag(f.forslag_id, {
        redigert_forslag: this.redigert_forslag,
        endret,
      })
        .then((response) => {
          this.$store.dispatch("show_snackbar", {
            message: response.data,
            color: "success",
          });
          this.cancelEdit();
          this.getOppslag(this.oppslagId);
          this.$emit("refresh");
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    avvisForslag(f) {
      JishoDataService.avvisForslag(f.forslag_id)
        .then((response) => {
          this.$store.dispatch("show_snackbar", {
            message: response.data,
            color: "success",
          });
          this.getOppslag(this.oppslagId);
          this.$emit("refresh");
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    fjernForslag(f) {
      JishoDataService.fjernForslag(f.forslag_id)
        .then((response) => {
          this.$store.dispatch("show_snackbar", {
            message: response.data,
            color: "success",
          });
          this.getOppslag(this.oppslagId);
          this.$emit("refresh");
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    getColorUp(f) {
      return f.minstemme === 1 ? "green" : "green-lighten-3";
    },
    getColorDown(f) {
      return f.minstemme === 0 ? "red" : "red-lighten-3";
    },
    checkEmpty() {
      if (this.nye_forslag.length > 0 && this.nye_forslag[0] != "") {
        if (this.nye_forslag[this.nye_forslag.length - 1] == "") {
          this.nye_forslag.pop();
        }
      }
    },
  },

  mounted() {
    this.getOppslag(this.oppslagId);
  },
});
</script>

<style scoped>
.definisjon-rad {
  border-left: 3px solid #4caf50;
  border-radius: 4px;
  transition: background-color 0.15s;
}
.definisjon-rad:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.forslag-rad {
  padding-left: 12px;
  padding-right: 4px;
  border-left: 3px solid #ef5350;
  border-radius: 4px;
  transition: background-color 0.15s;
}
.forslag-rad:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.erstatt-boks {
  border: 1px dashed #ef5350;
  background-color: rgba(239, 83, 80, 0.04);
}
</style>

