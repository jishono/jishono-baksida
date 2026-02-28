<template>
  <v-card v-if="lemma">
    <v-card-title class="pr-2 d-flex align-center justify-space-between flex-wrap">
      <div class="text-h6">
        {{ lemma.oppslag }}
        <span class="text-body-2 text-medium-emphasis">({{ lemma.boy_tabell }})</span>
      </div>
      <div class="d-flex align-center">
        <v-btn
          color="primary"
          :href="
            'https://ordbok.uib.no/perl/ordbok.cgi?OPP=' +
            lemma.oppslag +
            '&bokmaal=+'
          "
          target="_blank"
          size="small"
          variant="outlined"
          class="mr-1"
        >
          <v-icon start>mdi-open-in-new</v-icon>
          BMO
        </v-btn>
        <v-btn
          color="primary"
          :href="'https://naob.no/s%C3%B8k/' + lemma.oppslag"
          target="_blank"
          size="small"
          variant="outlined"
          class="mr-1"
        >
          <v-icon start>mdi-open-in-new</v-icon>
          NAOB
        </v-btn>
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-icon
              color="grey-darken-3"
              class="mr-2"
              v-bind="props"
              @click="lenke"
            >
              mdi-link
            </v-icon>
          </template>
          <span>{{ $t("knapper.lenke") }}</span>
        </v-tooltip>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <div class="mb-3">
        <div
          v-for="(d, i) in lemma.definisjon"
          :key="'def-' + i"
          class="text-green-darken-2 py-1"
        >
          <span class="text-caption font-weight-bold mr-1">{{ i + 1 }}.</span
          >{{ d.definisjon || d }}
        </div>
        <div
          v-for="(f, j) in (lemma.forslag ?? [])"
          :key="f.forslag_id"
          class="text-error py-1"
        >
          <div class="d-flex align-center flex-wrap" style="gap: 6px">
            <span class="text-caption font-weight-bold mr-1"
              >{{ lemma.definisjon.length + j + 1 }}.</span
            ><span v-html="addFurigana(f.forslag_definisjon)"></span>
            <span class="text-caption text-medium-emphasis ml-1"
              >— {{ f.brukernavn }}</span
            >
            <span
              class="text-caption text-medium-emphasis"
              v-if="f.endret"
              >({{ $t("veggen.endret") }})</span
            >
            <div class="d-flex" style="gap: 4px">
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
            </div>
            <div v-if="f.status == 0" class="d-flex" style="gap: 2px">
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
            </div>
          </div>
          <div v-if="editing_forslag_id === f.forslag_id" class="mt-2">
            <v-text-field
              v-model="redigert_forslag"
              counter
              maxlength="100"
              variant="outlined"
              density="compact"
            ></v-text-field>
            <div class="d-flex justify-end" style="gap: 6px">
              <v-btn size="small" color="red" @click="cancelEdit">
                {{ $t("knapper.avbryt") }}
              </v-btn>
              <v-btn
                v-if="$store.getters.user_id == f.user_id"
                size="small"
                color="green"
                @click="redigerForslag(f)"
              >
                {{ $t("knapper.oppdater") }}
              </v-btn>
              <v-btn
                v-if="$store.getters.isAdmin"
                size="small"
                color="green"
                @click="godkjennForslag(f)"
              >
                {{ $t("knapper.godkjenn") }}
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <div v-if="$store.getters.isLoggedIn" class="mt-2">
        <div v-for="(ny_def, index2) in nye_forslag" :key="index2 + 100">
          <v-text-field
            v-model="nye_forslag[index2]['definisjon']"
            counter
            maxlength="100"
            variant="outlined"
            density="compact"
          >
            <template v-slot:label>
              {{ maruSuji(lemma.definisjon.length + (lemma.forslag?.length ?? 0) + index2 + 1) }}
              {{ $t("forslag.forslag_definisjon") }}
            </template>
            <template v-slot:append>
              <div v-if="index2 == nye_forslag.length - 1">
                <v-icon color="green-lighten-1" @click="addDef">mdi-plus-circle</v-icon>
                <v-icon
                  v-if="nye_forslag.length > 1"
                  color="red-lighten-1"
                  @click="removeDef"
                >mdi-minus-circle</v-icon>
              </div>
            </template>
          </v-text-field>
        </div>
        <div class="d-flex justify-end mb-4">
          <v-btn size="small" color="green" @click="addForslag">
            {{ $t("knapper.foreslå") }}
          </v-btn>
        </div>
      </div>

      <div class="d-flex align-center justify-space-between mb-2">
        <span class="text-h6">{{ $t("kommentar.kommentarer") }}</span>
        <v-btn color="green" size="small" @click="postKommentar">
          {{ $t("kommentar.post_kommentar") }}
        </v-btn>
      </div>
      <v-textarea
        variant="outlined"
        :label="$t('kommentar.ny_kommentar')"
        v-model="ny_kommentar"
        rows="4"
      ></v-textarea>
      <div v-if="kommentarer">
        <div v-for="kom in kommentarer" :key="kom.lemma_kommentar_id">
          <v-card class="mb-4">
            <v-card-title class="headline bg-orange-lighten-3 text-body-2 pa-0">
              <v-col cols="5">
                <v-avatar :color="randomFarge(kom.brukernavn)" size="32">
                  <span class="text-white">{{ initialer(kom.brukernavn) }}</span>
                </v-avatar>
                <span class="font-weight-black ml-1">{{ kom.brukernavn }}</span>
              </v-col>
              <v-col align="end">
                {{ new Date(kom.opprettet).toLocaleString("da-DK") }}
              </v-col>
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
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
import { defineComponent } from "vue";

import VueMarkdown from "vue-markdown-render";
import { full as markdownItEmoji } from "markdown-it-emoji";
import helpers from "../mixins/helpers";
import JishoDataService from "../services/JishoDataService";

export default defineComponent({
  emits: ["close", "refresh"],
  name: "oppslag-kommentarer",
  mixins: [helpers],
  components: {
    VueMarkdown,
  },

  data() {
    return {
      lemma: null,
      ny_kommentar: "",
      kommentarer: [],
      markdownItEmoji,
      editing_forslag_id: null,
      redigert_forslag: "",
      nye_forslag: [{ definisjon: "", prioritet: null }],
    };
  },

  props: {
    lemma_id: Number,
  },

  watch: {
    lemma_id(newVal) {
      if (!newVal) return;
      this.ny_kommentar = "";
      this.cancelEdit();
      this.nye_forslag = [{ definisjon: "", prioritet: null }];
      this.hentLemmaData();
    },
  },

  methods: {
    hentLemmaData() {
      JishoDataService.get(this.lemma_id)
        .then((response) => {
          this.lemma = response.data;
          this.hentKommentarer();
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    hentKommentarer() {
      JishoDataService.getForslagKommentarer(this.lemma_id)
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
    addForslag() {
      this.checkEmpty();
      const nDef = this.lemma.definisjon.length;
      const nForslag = this.lemma.forslag?.length ?? 0;
      for (let i = 0; i < this.nye_forslag.length; i++) {
        this.nye_forslag[i].prioritet = nDef + nForslag + i + 1;
      }
      JishoDataService.addForslag(this.lemma_id, {
        nye_forslag: this.nye_forslag,
        lemma_id: this.lemma_id,
      })
        .then((response) => {
          this.$store.dispatch("show_snackbar", {
            message: response.data,
            color: "success",
          });
          this.nye_forslag = [{ definisjon: "", prioritet: null }];
          this.hentLemmaData();
          this.$emit("refresh");
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    addDef() {
      this.nye_forslag.push({ definisjon: "", prioritet: null });
    },
    removeDef() {
      this.nye_forslag.pop();
    },
    checkEmpty() {
      if (this.nye_forslag.length > 0 && this.nye_forslag[0] != "") {
        if (this.nye_forslag[this.nye_forslag.length - 1] == "") {
          this.nye_forslag.pop();
        }
      }
    },
    postKommentar() {
      if (this.ny_kommentar !== "") {
        JishoDataService.postForslagKommentar(this.lemma_id, {
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
    openEdit(f) {
      this.editing_forslag_id = f.forslag_id;
      this.redigert_forslag = f.forslag_definisjon;
    },
    cancelEdit() {
      this.editing_forslag_id = null;
      this.redigert_forslag = "";
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
            this.hentLemmaData();
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
          this.hentLemmaData();
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
          this.hentLemmaData();
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
          this.hentLemmaData();
          this.$emit("refresh");
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    stemForslag(f, type) {
      JishoDataService.stemForslag(f.forslag_id, { type })
        .then((response) => {
          this.$store.dispatch("show_snackbar", {
            message: response.data,
            color: "success",
          });
          this.hentLemmaData();
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
    lenke() {
      const url =
        "https://baksida.jisho.no/forslag/lemma/" + this.lemma_id;
      navigator.clipboard.writeText(url).then(() => {
        this.$store.dispatch("show_snackbar", {
          message: this.$t("varsler.kopiert"),
          color: "success",
        });
      });
    },
  },

  mounted() {
    if (this.lemma_id) this.hentLemmaData();
  },
});
</script>
