<template>
  <v-container v-if="this.currentOppslag">
    <v-row>
      <v-col align="center">
        <v-snackbar
          v-model="snackbar"
          :timeout="timeout"
          color="success"
          top
        >
          Oppdatert!
        </v-snackbar>

        <Boyningstabell
          v-if="$store.getters.boy_ok.includes(currentOppslag.boy_tabell)"
          v-bind:lemma_id="currentOppslag.lemma_id"
          :boyningsDialog.sync="boyningsDialog"
          @outside_click="boyningsDialog = false"
        />
        <v-btn
          v-if="$store.getters.boy_ok.includes(currentOppslag.boy_tabell)"
          color="primary"
          @click="boyningsDialog = true"
        >
          Vis bøyning
        </v-btn>
        <v-btn
          v-if="$store.getters.isAdmin"
          dark
          color="accent"
          @click="updateOppslag"
          class="mx-2"
        >
          Oppdater
        </v-btn>
        <v-btn
          v-if="!$store.getters.isAdmin"
          dark
          color="accent"
          @click="addForslag"
          class="mx-2"
        >
          Foreslå
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        md=6
        sm=6
      >
        <h1 v-if="$store.getters.isAdmin">Endre</h1>
        <h1 v-if="!$store.getters.isAdmin">Forslag</h1>
        <v-card>
          <v-card-title class="pb-3">

          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model="currentOppslag.lemma_id"
                label="Lemma ID"
                outlined
                disabled
              />
              <v-text-field
                v-model="currentOppslag.oppslag"
                label="Oppslag"
                outlined
                disabled
              />
              <v-text-field
                v-model="currentOppslag.boy_tabell"
                label="Hovedordklasse"
                outlined
                disabled
              />
              <v-text-field
                v-model="currentOppslag.ledd"
                label="Ledd"
                outlined
                :disabled="!$store.getters.isAdmin"
              />
              <div
                v-for="(ut,index) in currentOppslag.uttale"
                v-bind:key="ut.index"
              >

                <v-text-field
                  v-model="ut.transkripsjon"
                  outlined
                  :disabled="!$store.getters.isAdmin"
                >
                  <template v-slot:label>
                    Uttale {{index+1}}
                  </template>
                  <template v-slot:append>
                    <div v-if="index == currentOppslag.uttale.length-1 && $store.getters.isAdmin">
                      <v-icon
                        color="green lighten-1"
                        v-on:click="addUttale"
                      >mdi-plus-circle </v-icon>
                      <v-icon
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
                  outlined
                >
                  <template
                    v-slot:label
                    v-if="$store.getters.isAdmin"
                  >
                    Definisjon {{index+1}}
                  </template>
                  <template
                    v-slot:label
                    v-else
                  >
                    Forslag til definisjon {{index+1}}
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
        <h1>Kommentarer</h1>
        <v-textarea
          outlined
          label="Ny kommentar"
          v-model="nyKommentar"
        ></v-textarea>
        <div v-if="currentOppslag.kommentar">
          <div
            v-for="(kom) in currentOppslag.kommentar"
            v-bind:key="kom.kom_id"
          >
            <v-card class="mb-4">
              <v-card-title
                class="headline grey lighten-3 body-2 pa-0"
                primary-title
              >
                <v-col cols=5>
                  <span class="font-weight-black"> {{ kom.bruker}} </span>
                </v-col>
                <v-col align="end">
                  {{ new Date(kom.opprettet).toLocaleString("da-DK")}}
                </v-col>
              </v-card-title>
              <v-card-text class="pa-3">
                <div class="text--primary">{{ kom.kommentar}}</div>
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
      nyKommentar: "",
      deleteData: {
        def: [],
        uttale: []
      },
      snackbar: false,
      timeout: 2000,
      boyningsDialog: false
    };
  },
  methods: {
    getOppslag (id) {
      JishoDataService.get(id)
        .then(response => {
          this.currentOppslag = response.data;
          if (this.currentOppslag.uttale.length == 0) {
            this.addUttale()
          }
          if (this.currentOppslag.definisjon.length == 0) {
            this.addDef()
          }
          this.getKommentarer(id)
        })
        .catch(e => {
          console.log(e);
        });
    },
    getKommentarer (id) {
      JishoDataService.get_kommentarer(id)
        .then(response => {
          this.$set(this.currentOppslag, 'kommentar', response.data)
        })
        .catch(e => {
          console.log(e);
        });
    },
    updateOppslag () {
      this.checkEmpty()
      if (this.nyKommentar != '') {
        this.addKommentar()
      }
      JishoDataService.update(this.currentOppslag.lemma_id, { oppslag: this.currentOppslag, deldata: this.deleteData })
        .then(() => {
          this.nyKommentar = ''
          this.deleteData.def = []
          this.deleteData.uttale = []
          this.getOppslag(this.currentOppslag.lemma_id)
          this.snackbar = true
        })
        .catch(e => {
          console.log(e);
        });

    },
    addForslag () {
      this.checkEmpty()
      if (this.nyKommentar != '') {
        this.addKommentar()
      }
      JishoDataService.forslag(this.currentOppslag.lemma_id, { oppslag: this.currentOppslag })
        .then(() => {
          console.log("ok")
          this.snackbar = true
          setTimeout(() => this.$router.push('/forslag'), 2000)
        })
        .catch(e => {
          console.log(e);
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
    addKommentar () {
      this.currentOppslag.kommentar.unshift(
        {
          "kom_id": null,
          "lemma_id": this.currentOppslag.lemma_id,
          "kommentar": this.nyKommentar,
          "bruker": this.$store.getters.user
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
      if (this.currentOppslag.uttale.length > 0) {
        if (this.currentOppslag.uttale[this.currentOppslag.uttale.length - 1].transkripsjon == "") {
          this.currentOppslag.uttale.pop()
        }
      }
    },
  },
  mounted () {
    this.getOppslag(this.$route.params.id);

  }
};
</script>