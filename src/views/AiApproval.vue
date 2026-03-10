<template>
  <div>
    <v-dialog v-model="oppslagDialog" :fullscreen="!$vuetify.display.smAndUp" :width="$vuetify.display.smAndUp ? 540 : undefined">
      <Oppslag :lemma_id="oppslagDialogId" @close="oppslagDialog = false" />
    </v-dialog>
    <div
      v-if="batch.length === 0 && !loading"
      class="text-center mt-10 text-medium-emphasis"
    >
      {{ $t("ai_approval.empty") }}
    </div>
    <v-card v-else-if="currentOppslag" class="mx-auto mt-4 d-flex flex-column" style="max-width: 500px; width: 100%; height: 520px">
      <v-card-title class="pb-0">
        <div class="text-h3">{{ currentOppslag.oppslag }}</div>
        <div class="text-body-2 text-medium-emphasis mt-1">
          {{ ordklasseNavn(currentOppslag.boy_tabell) }} · #{{
            currentOppslag.lemma_id
          }}
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
          <v-dialog v-model="instruksDialog" :width="$vuetify.display.mdAndUp ? 800 : '100%'">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" variant="outlined" size="small" v-bind="props">
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
        </div>
      </v-card-title>
      <v-card-text style="overflow-y: auto; flex: 1">
        <v-divider class="mt-4 mb-3" />
        <div
          v-for="(def, index) in aiDefs"
          :key="def.def_id"
          class="d-flex align-center mb-2 py-1 pl-3"
        >
          <span
            class="text-medium-emphasis font-weight-bold mr-2"
            style="font-size: 1.15rem"
            >{{ maruSuji(index + 1) }}</span
          >
          <span
            style="font-size: 1.15rem; line-height: 1.6"
            class="flex-grow-1"
            v-html="addFurigana(def.definisjon)"
          ></span>
          <v-tooltip location="top">
            <template v-slot:default>
              <div>{{ $t("forslag.ai_ingen_godkjenninger") }}</div>
              <div v-if="def.ai_approvals && def.ai_approvals.length">
                {{
                  $t("forslag.ai_godkjent_av", {
                    brukernavn: def.ai_approvals
                      .map((a) => a.username)
                      .join(", "),
                  })
                }}
              </div>
            </template>
            <template v-slot:activator="{ props: approvalProps }">
              <v-chip
                v-bind="approvalProps"
                size="small"
                :color="
                  hasMyApproval(def) ? 'green-darken-1' : 'green-lighten-3'
                "
                variant="flat"
                class="ml-2 flex-shrink-0"
                style="cursor: pointer; align-self: center"
                @click.stop="toggleAiApproval(def)"
              >
                <span class="mr-1">{{ def.ai_approvals ? def.ai_approvals.length : 0 }}</span>
                <v-icon size="16">mdi-thumb-up-outline</v-icon>
              </v-chip>
            </template>
          </v-tooltip>
        </div>
      </v-card-text>
      <v-card-actions class="justify-space-between px-4 pb-4 pt-2 flex-wrap">
        <v-btn :disabled="currentIndex === 0" @click="currentIndex--">
          <v-icon :start="$vuetify.display.smAndUp">mdi-arrow-left</v-icon>
          <span class="d-none d-sm-inline">{{ $t("ai_approval.previous") }}</span>
        </v-btn>
        <v-btn
          color="orange"
          variant="flat"
          class="text-white"
          @click="openOppslag(currentOppslag.lemma_id)"
        >
          <v-icon start color="white">mdi-alert-circle</v-icon>{{ $t("ai_approval.open") }}
        </v-btn>
        <v-btn @click="next()">
          <span class="d-none d-sm-inline">{{ $t("ai_approval.next") }}</span>
          <v-icon :end="$vuetify.display.smAndUp">mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import InstruksBoks from "../components/InstruksBoks.vue";
import helpers from "../mixins/helpers.js";
import JishoDataService from "../services/JishoDataService.js";
import Oppslag from "./Oppslag.vue";

export default defineComponent({
  name: "AiApproval",
  mixins: [helpers],
  components: { Oppslag, InstruksBoks },

  data() {
    return {
      batch: [],
      currentIndex: 0,
      loading: false,
      oppslagDialog: false,
      oppslagDialogId: null,
      instruksDialog: false,
    };
  },

  computed: {
    currentOppslag() {
      return this.batch[this.currentIndex] ?? null;
    },
    aiDefs() {
      if (!this.currentOppslag) return [];
      return (this.currentOppslag.definisjon ?? []).filter(
        (d) => d.source === "AI",
      );
    },
  },

  methods: {
    openOppslag(lemma_id) {
      this.oppslagDialogId = lemma_id;
      this.oppslagDialog = true;
    },
    async loadBatch() {
      this.loading = true;
      try {
        const response = await JishoDataService.getRandomAiTranslations();
        this.batch = response.data.map((o) => {
          o.definisjon.sort((a, b) => a.prioritet - b.prioritet);
          return o;
        });
        this.currentIndex = 0;
      } catch (error) {
        this.$store.dispatch("show_snackbar", {
          message: error.response?.data,
          color: "error",
        });
      } finally {
        this.loading = false;
      }
    },
    next() {
      if (this.currentIndex < this.batch.length - 1) {
        this.currentIndex++;
      } else {
        this.loadBatch();
      }
    },
    hasMyApproval(def) {
      if (!def.ai_approvals) return false;
      return def.ai_approvals.some(
        (a) => a.user_id == this.$store.getters.user_id,
      );
    },
    toggleAiApproval(def) {
      if (this.hasMyApproval(def)) {
        JishoDataService.removeAiApproval(def.def_id)
          .then(() => this.refreshCurrent())
          .catch((error) => {
            this.$store.dispatch("show_snackbar", {
              message: error.response?.data,
              color: "error",
            });
          });
      } else {
        JishoDataService.addAiApproval(def.def_id)
          .then(() => this.refreshCurrent())
          .catch((error) => {
            this.$store.dispatch("show_snackbar", {
              message: error.response?.data,
              color: "error",
            });
          });
      }
    },
    async refreshCurrent() {
      if (!this.currentOppslag) return;
      try {
        const response = await JishoDataService.get(
          this.currentOppslag.lemma_id,
        );
        const oppslag = response.data;
        oppslag.definisjon.sort((a, b) => a.prioritet - b.prioritet);
        this.batch.splice(this.currentIndex, 1, oppslag);
      } catch {
        // silently ignore
      }
    },
    handleKeydown(e) {
      if (e.key === "ArrowLeft" && this.currentIndex > 0) this.currentIndex--;
      if (e.key === "ArrowRight") this.next();
    },
  },

  mounted() {
    this.loadBatch();
    window.addEventListener("keydown", this.handleKeydown);
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
});
</script>
