<template>
  <div
    v-if="currentOppslag"
    class="pa-0"
  >
    <Boyningstabell
      v-if="$store.getters.boy_ok.includes(currentOppslag.boy_tabell)"
      v-bind:lemma_id="currentOppslag.lemma_id"
      :boyningsDialog.sync="boyningsDialog"
      @outside_click="boyningsDialog = false"
    />
    <v-card
      width="500"
      class="mx-auto"
    >
      <v-card-title>
        Nytt forslag
      </v-card-title>
      <v-card-text>
        <div class="text-h3">{{currentOppslag.oppslag}}</div>
        <div>Lemma ID: {{currentOppslag.lemma_id}}</div>
        <div>Ordklasse: {{currentOppslag.boy_tabell}}</div>
        <v-form
          ref="form"
          class="mt-4"
        >
          <div
            v-for="(def,index) in forslag_definisjoner"
            v-bind:key="index"
          >
            <v-text-field
              v-model="forslag_definisjoner[index]"
              counter
              maxlength="100"
              outlined
            >
              <template v-slot:label>
                Forslag til definisjon {{index+1}}
              </template>
              <template v-slot:append>
                <div v-if="index == forslag_definisjoner.length-1">
                  <v-icon
                    color="green lighten-1"
                    v-on:click="addDef"
                  >mdi-plus-circle </v-icon>
                  <v-icon
                    v-if="forslag_definisjoner.length > 1"
                    color="red lighten-1"
                    v-on:click="removeDef"
                  >mdi-minus-circle </v-icon>
                </div>
              </template>
            </v-text-field>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-dialog
          v-model="instruksDialog"
          width="800"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="mr-2"
              color="green"
              dark
              v-on="on"
              :small="$vuetify.breakpoint.xsOnly"
            >
              Instruks
            </v-btn>
          </template>
          <InstruksBoks>

          </InstruksBoks>
        </v-dialog>
        <v-btn
          color="primary"
          @click="boyningsDialog = true"
          :small="$vuetify.breakpoint.xsOnly"
        >
          Bøyning
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn
          dark
          color="red"
          @click="$router.go(-1)"
          :small="$vuetify.breakpoint.xsOnly"
        >
          Avbryt
        </v-btn>
        <v-btn
          dark
          color="green"
          @click="addForslag"
          :small="$vuetify.breakpoint.xsOnly"
        >
          Foreslå
        </v-btn>
      </v-card-actions>
    </v-card>

  </div>
</template>

<script>
import JishoDataService from "../services/JishoDataService";
import Boyningstabell from '../components/Boyningstabell.vue';
import InstruksBoks from '../components/InstruksBoks.vue';

export default {
  name: "nytt-forslag",
  data () {
    return {
      currentOppslag: null,
      forslag_definisjoner: [''],
      boyningsDialog: false,
      instruksDialog: false,
    };
  },
  components: {
    Boyningstabell,
    InstruksBoks
  },
  methods: {
    getOppslag (id) {
      JishoDataService.get(id)
        .then(response => {
          this.currentOppslag = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    addForslag () {
      this.checkEmpty()
      JishoDataService.addForslag(this.currentOppslag.lemma_id, {
        forslag_definisjoner: this.forslag_definisjoner,
        lemma_id: this.currentOppslag.lemma_id
      })
        .then((response) => {
          this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
          setTimeout(() => this.$router.push('/forslag'), 2000)
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
          console.log(error)
        });
    },
    addDef () {
      this.forslag_definisjoner.push('')
    },
    removeDef () {
      this.forslag_definisjoner.pop()
    },
    checkEmpty () {
      if (this.forslag_definisjoner.length > 0 && this.forslag_definisjoner[0] != '') {
        if (this.forslag_definisjoner[this.forslag_definisjoner.length - 1] == '') {
          this.forslag_definisjoner.pop()
        }
      }
    },
  },
  mounted () {
    this.getOppslag(this.$route.params.id);

  }
};
</script>