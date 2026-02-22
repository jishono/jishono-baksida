<template>
  <div v-if="currentOppslag" class="pa-0">
    <Boyningstabell
      v-if="$store.getters.boy_ok.includes(currentOppslag.boy_tabell)"
      v-bind:lemma_id="currentOppslag.lemma_id"
      v-model:boyningsDialog="boyningsDialog"
      @outside_click="boyningsDialog = false"
    />
    <v-card width="500" class="mx-auto">
      <v-card-title>
        {{ $t("navbar.nytt_forslag") }}
        <v-spacer></v-spacer>
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
          <v-icon start>mdi-open-in-new</v-icon>
          BMO
        </v-btn>
        <v-btn
          color="primary"
          :href="'https://naob.no/s%C3%B8k/' + currentOppslag.oppslag"
          target="_blank"
          class="ml-1"
          variant="outlined"
          size="small"
        >
          <v-icon start>mdi-open-in-new</v-icon>
          NAOB
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="text-h3 mb-2">
          <span>{{ currentOppslag.oppslag }}</span>
        </div>
        <div>{{ $t("ord.lemma_id") }}: {{ currentOppslag.lemma_id }}</div>
        <div>{{ $t("ord.ordklasse") }}: {{ currentOppslag.boy_tabell }}</div>

        <div
          class="mt-4"
          v-for="(def, index) in currentOppslag.definisjon"
          v-bind:key="index"
        >
          <v-text-field
            v-model="currentOppslag.definisjon[index].definisjon"
            disabled
            variant="outlined"
          >
            <template v-slot:label>
              {{ maruSuji(index + 1) }} {{ $t("forslag.eksisterende_definisjon") }}
            </template>
          </v-text-field>
        </div>
        <div v-for="(ny_def, index2) in nye_forslag" v-bind:key="index2 + 100">
          <v-text-field
            v-model="nye_forslag[index2]['definisjon']"
            counter
            maxlength="100"
            variant="outlined"
          >
            <template v-slot:label>
              {{ maruSuji(currentOppslag.definisjon.length + index2 + 1) }}
              {{ $t("forslag.forslag_definisjon") }}
            </template>
            <template v-slot:append>
              <v-icon color="orange" v-on:click="toggleComment(index2)"
                >mdi-comment-text-outline
              </v-icon>
              <div v-if="index2 == nye_forslag.length - 1">
                <v-icon color="green-lighten-1" v-on:click="addDef"
                  >mdi-plus-circle
                </v-icon>
                <v-icon
                  v-if="nye_forslag.length > 1"
                  color="red-lighten-1"
                  v-on:click="removeDef"
                  >mdi-minus-circle
                </v-icon>
              </div>
            </template>
          </v-text-field>
          <v-textarea
            v-model="nye_forslag[index2]['kommentar']"
            v-if="nye_forslag[index2]['kommentar'] != null"
            rows="4"
            variant="outlined"
          >
            <template v-slot:label>
              {{ $t("kommentar.kommentar") }} til
              {{ maruSuji(currentOppslag.definisjon.length + index2 + 1) }}
            </template>
          </v-textarea>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-dialog v-model="instruksDialog" width="800">
          <template v-slot:activator="{ props }">
            <v-btn class="mr-2" color="primary" v-bind="props">
              {{ $t("knapper.instruks") }}
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <InstruksBoks />
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-btn color="primary" @click="boyningsDialog = true">
          {{ $t("knapper.boyning") }}
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn class="d-none d-sm-flex" color="red" @click="$router.go(-1)">
          {{ $t("knapper.avbryt") }}
        </v-btn>
        <v-btn class="d-none d-sm-flex" color="green" @click="addForslag">
          {{ $t("knapper.foreslå") }}
        </v-btn>
        <v-btn
          class="d-sm-none"
          color="red"
          icon
          @click="$router.go(-1)"
          size="small"
        >
          <v-icon> mdi-close </v-icon>
        </v-btn>
        <v-btn
          class="d-sm-none"
          color="green"
          icon
          @click="addForslag"
          size="small"
        >
          <v-icon> mdi-check </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import Boyningstabell from "../components/Boyningstabell.vue";
import InstruksBoks from "../components/InstruksBoks.vue";
import helpers from "../mixins/helpers";
import JishoDataService from "../services/JishoDataService";

export default defineComponent({
  name: "nytt-forslag",
  mixins: [helpers],

  data() {
    return {
      currentOppslag: null,
      nye_forslag: [{ definisjon: "", kommentar: null, prioritet: null }],
      boyningsDialog: false,
      instruksDialog: false,
    };
  },

  components: {
    Boyningstabell,
    InstruksBoks,
  },

  methods: {
    getOppslag(id) {
      JishoDataService.get(id)
        .then((response) => {
          this.currentOppslag = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addForslag() {
      this.checkEmpty();
      const nDef = this.currentOppslag.definisjon.length;
      const nForslag = (this.currentOppslag.forslag || []).length;
      for (let i = 0; i < this.nye_forslag.length; i++) {
        this.nye_forslag[i].prioritet = nDef + nForslag + i + 1;
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
          setTimeout(() => this.$router.push("/forslag"), 2000);
        })
        .catch((error) => {
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
          console.log(error);
        });
    },
    addDef() {
      this.nye_forslag.push({ definisjon: "", kommentar: null });
    },
    removeDef() {
      this.nye_forslag.pop();
    },
    toggleComment(index) {
      if (this.nye_forslag[index].kommentar === null) {
        this.nye_forslag[index].kommentar = "";
      } else {
        this.nye_forslag[index].kommentar = null;
      }
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
    this.getOppslag(this.$route.params.id);
  },
});
</script>
