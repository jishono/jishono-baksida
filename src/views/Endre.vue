<template>
  <v-container v-if="this.currentOppslag && $store.getters.isAdmin">
    <v-row>
      <v-col align="center">
        <boyningstabell
          v-if="$store.getters.boy_ok.includes(currentOppslag.boy_tabell)"
          v-bind:lemma_id="currentOppslag.lemma_id"
          :boyningsDialog.sync="boyningsDialog"
          @outside_click="boyningsDialog = false"
        />
         <v-btn
            color="primary"
            :href="'https://ordbok.uib.no/perl/ordbok.cgi?OPP=' + currentOppslag.oppslag + '&bokmaal=+'"
            target="_blank"
            outlined
            class="mx-1"
          >
          <v-icon left>mdi-open-in-new</v-icon>
            BMO
          </v-btn>
          <v-btn
            color="primary"
            :href="'https://naob.no/s%C3%B8k/' + currentOppslag.oppslag"
            target="_blank"
            outlined
            class="mx-1"
          >
          <v-icon left>mdi-open-in-new</v-icon>
            NAOB
          </v-btn>
        <v-btn
          v-if="$store.getters.boy_ok.includes(currentOppslag.boy_tabell)"
          color="primary"
          @click="boyningsDialog = true"
          class="mx-1"
        >
          {{ $t("knapper.vis_boyning") }}
        </v-btn>
        <v-btn
          color="primary"
          :to="'/nytt_forslag/' + currentOppslag.lemma_id"
          class="mx-1"
        >
          Nytt forslag
        </v-btn>
        <v-btn
          dark
          color="green"
          @click="updateOppslag"
          class="mx-1"
        >
          {{ $t("knapper.oppdater") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        md=6
        sm=6
      >
        <h1>{{ $t("navbar.endre") }}</h1>
        <v-card>
          <v-card-title class="pb-3">

          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model="currentOppslag.lemma_id"
                :label="$t('ord.lemma_id')"
                outlined
                disabled
              />

              <v-text-field
                v-model="currentOppslag.oppslag"
                :label="$t('ord.oppslagsord')"
                outlined
                disabled
              />
              <v-text-field
                v-model="currentOppslag.boy_tabell"
                :label="$t('ord.ordklasse')"
                outlined
                disabled
              />
              <v-text-field
                v-model="currentOppslag.ledd"
                :label="$t('ord.ledd')"
                outlined
              />
              <div
                v-for="(ut,index_ut) in currentOppslag.uttale"
                v-bind:key="ut.index_ut"
              >

                <v-text-field
                  v-model="ut.transkripsjon"
                  outlined
                >
                  <template v-slot:label>
                    {{ $t('ord.uttale') }} {{index_ut+1}}
                  </template>
                  <template v-slot:append>
                    <div v-if="index_ut == currentOppslag.uttale.length-1 && $store.getters.isAdmin">
                      <v-icon
                        color="green lighten-1"
                        v-on:click="addUttale"
                      >mdi-plus-circle </v-icon>
                      <v-icon
                        v-if="currentOppslag.uttale.length > 1"
                        color="red lighten-1"
                        v-on:click="removeUttale"
                      >mdi-minus-circle </v-icon>
                    </div>
                  </template>
                </v-text-field>
              </div>

              <div
                v-for="(def,index) in currentOppslag.definisjon"
                v-bind:key="index"
              >

                <v-text-field
                  v-model="def.definisjon"
                  counter
                  maxlength="100"
                  outlined
                >
                  <template v-slot:label>
                    {{ $t('ord.definisjon') }} {{index+1}}
                  </template>
                  <template v-slot:append>
                    <div v-if="index == currentOppslag.definisjon.length-1">
                      <v-icon
                        color="green lighten-1"
                        v-on:click="addDef"
                      >mdi-plus-circle </v-icon>
                      <v-icon
                        color="red lighten-1"
                        v-on:click="removeDef"
                      >mdi-minus-circle </v-icon>
                    </div>
                  </template>
                </v-text-field>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        md=6
        sm=6
        cols=12
      >
        <h1>{{ $t('kommentar.kommentarer') }}</h1>
        <v-textarea
          outlined
          :label="$t('kommentar.ny_kommentar')"
          v-model="ny_kommentar"
        ></v-textarea>
        <div v-if="currentOppslag.kommentarer">
          <div
            v-for="(kom) in currentOppslag.kommentarer"
            v-bind:key="kom.kom_id"
          >
            <v-card class="mb-4">
              <v-card-title
                class="headline grey lighten-3 body-2 pa-0"
                primary-title
              >
                <v-col cols=5>
                  <span class="font-weight-black"> {{ kom.brukernavn}} </span>
                </v-col>
                <v-col align="end">
                  {{ new Date(kom.opprettet).toLocaleString("da-DK")}}
                </v-col>
              </v-card-title>
              <v-card-text class="pa-3">
                <vue-simple-markdown
                  class="text--primary linjeskift"
                  :source="kom.kommentar"
                ></vue-simple-markdown>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-col>
    </v-row>

  </v-container>

</template>

<script>
import JishoDataService from "../services/JishoDataService";
import Boyningstabell from '../components/Boyningstabell.vue';

export default {
  name: "Endre",
  components: {
    Boyningstabell,
  },
  data () {
    return {
      currentOppslag: null,
      ny_kommentar: "",
      deleteData: {
        def: [],
        uttale: []
      },
      boyningsDialog: false
    };
  },
  methods: {
    refreshOppslag () {
      JishoDataService.get(this.$route.params.id)
        .then(response => {
          this.currentOppslag = response.data;
          if (this.currentOppslag.uttale.length == 0) {
            this.addUttale()
          }
          if (this.currentOppslag.definisjon.length == 0) {
            this.addDef()
          }
        })
        .catch(e => {
          console.log(e);
        });
    },

    updateOppslag () {
      this.checkEmpty()
      if (this.nyKommentar != '') {
        this.currentOppslag['ny_kommentar'] = this.ny_kommentar
      }
      JishoDataService.update(this.currentOppslag.lemma_id, { oppslag: this.currentOppslag, deldata: this.deleteData })
        .then((response) => {
          this.ny_kommentar = ''
          this.deleteData.def = []
          this.deleteData.uttale = []
          this.refreshOppslag()
          this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
          console.log(error)
        });

    },
    addDef () {
      this.currentOppslag.definisjon.push(
        {
          "def_id": null,
          "lemma_id": this.currentOppslag.lemma_id,
          "prioritet": null,
          "definisjon": ""
        }
      );
    },
    addUttale () {
      this.currentOppslag.uttale.push(
        {
          "uttale_id": null,
          "lemma_id": this.currentOppslag.lemma_id,
          "transkripsjon": ""
        }
      );
    },
    removeDef () {
      let delDefArray = this.currentOppslag.definisjon.pop()
      if (delDefArray.def_id) {
        this.deleteData.def.push(delDefArray.def_id)
      }
    },
    removeUttale () {
      let delUttaleArray = this.currentOppslag.uttale.pop()
      if (delUttaleArray.uttale_id) {
        this.deleteData.uttale.push(delUttaleArray.uttale_id)
      }
    },
    checkEmpty () {
      if (this.currentOppslag.definisjon.length > 0) {
        if (this.currentOppslag.definisjon[this.currentOppslag.definisjon.length - 1].definisjon == "") {
          this.currentOppslag.definisjon.pop()
        }
      }
      if (this.currentOppslag.uttale.length > 0 && this.currentOppslag.uttale[0]['transkripsjon'] != '') {
        console.log(this.currentOppslag.uttale.length)
        if (this.currentOppslag.uttale[this.currentOppslag.uttale.length - 1].transkripsjon == "") {
          this.currentOppslag.uttale.pop()
        }
      }
    },
  },
  mounted () {
    this.refreshOppslag();

  }
};
</script>