<template>
  <v-container fluid>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        sm=6
        xs=12
      >
        <v-text-field
          v-model="q"
          rounded
          solo
          hide-details
          label="Søk etter ord/oppslag"
          @keypress.enter="sokOppslag()"
        >
          <template v-slot:append>
            <v-icon
              v-if="q"
              v-on:click="q=''"
            >mdi-close</v-icon>
            <v-icon v-on:click="sokOppslag()">mdi-magnify</v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="hidden-xs-only">
      </v-col>
      <v-col
        sm=6
        xs=12
      >
        <h4 v-if="oppslagsliste.length > 0">treff: {{ this.treff}} </h4>
        <v-card
          class="mx-auto"
          max-width="900"
          tile
        >
          <v-expansion-panels
            accordion
            v-model="showExpansion"
          >
            <v-expansion-panel
              v-for="(oppslag, index) in slicedResults"
              :key="index"
              @click="setActiveOppslag(oppslag, index)"
            >
              <v-expansion-panel-header v-slot="{ open }">
                <div v-if="open">
                  <span class="title font-weight-black">{{ oppslag.oppslag }}</span>
                  <span class="float-right"> {{ oppslag.boy_tabell }} </span>
                </div>
                <div v-else>
                  <span class="font-weight-bold">{{ oppslag.oppslag }}</span>
                  <span class="float-right"> {{ oppslag.boy_tabell }} </span>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content v-if="currentOppslag">
                <div class="text--primary body-1">
                  <span class="font-weight-bold"> Lemma ID: </span> {{ currentOppslag.lemma_id }} <br>
                  <span class="font-weight-bold"> Ledd: </span> {{ currentOppslag.ledd }} <br>
                  <span class="font-weight-bold"> Uttale: </span>
                  <span
                    v-for="(ut) in currentOppslag.uttale"
                    v-bind:key="ut.transkripsjon"
                  >
                    / {{ ut.transkripsjon }} /
                  </span>
                  <br>
                  <span class="font-weight-bold"> Definisjoner: </span><br>
                  <div
                    v-for="(definisjon) in currentOppslag.definisjon"
                    v-bind:key="definisjon.definisjon"
                    class="body-1"
                  >
                    {{ definisjon.prioritet }}:
                    {{ definisjon.definisjon }}
                  </div>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <div v-if="$store.getters.boy_ok.includes(currentOppslag.boy_tabell)">
                      <Boyningstabell
                        v-bind:lemma_id="currentOppslag.lemma_id"
                        :boyningsDialog.sync="boyningsDialog"
                        @outside_click="boyningsDialog = false"
                      />
                      <v-btn
                        small
                        color="primary"
                        @click="boyningsDialog = true"
                      >
                        Vis bøyning
                      </v-btn>
                    </div>
                    <v-btn
                      v-if="$store.getters.isAdmin"
                      small
                      color="accent"
                      :to="'/endre/' + currentOppslag.lemma_id"
                    >Endre</v-btn>
                    <v-btn
                      v-if="!$store.getters.isAdmin"
                      class="ml-2"
                      small
                      color="accent"
                      :to="'/endre/' + currentOppslag.lemma_id"
                    >Foreslå</v-btn>
                  </v-card-actions>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
      <v-col
        cols=3
        class="hidden-xs-only"
      >
        <h4>filter</h4>
        <v-checkbox
          class="pa-0 ma-0"
          label="med definisjoner"
          hide-details
          v-model="meduten.meddef"
          @click.native="sokOppslag()"
        >
        </v-checkbox>
        <v-checkbox
          class="pa-0 ma-0"
          hide-details
          label="uten definisjoner"
          v-model="meduten.utendef"
          @click.native="sokOppslag()"
        >
        </v-checkbox>
        <v-checkbox
          class="pa-0 ma-0"
          hide-details
          label="med uttale"
          v-model="meduten.medut"
          @click.native="sokOppslag()"
        >
        </v-checkbox>
        <v-checkbox
          class="pa-0 ma-0"
          hide-details
          label="uten uttale"
          v-model="meduten.utenut"
          @click.native="sokOppslag()"
        >
        </v-checkbox>
        <h5 class="mt-3">ordklasse</h5>
        <div
          class="custom-control custom-checkbox"
          v-for="(value,ordklasse) in pos"
          :key="ordklasse"
        >
          <v-checkbox
            class="pa-0 ma-0"
            hide-details
            :label="ordklasse"
            v-model="pos[ordklasse]"
            @click.native="sokOppslag()"
          >
          </v-checkbox>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import JishoDataService from "../services/JishoDataService";
import Boyningstabell from '../components/Boyningstabell.vue';
import _ from 'lodash';

export default {
  name: "oversikt",
  components: {
    Boyningstabell,
  },
  data () {
    return {
      oppslagsliste: [],
      showExpansion: false,
      currentOppslag: null,
      currentIndex: -1,
      tabellSynlig: false,
      q: "",
      treff: null,
      boyningsDialog: false,
      meduten: {
        meddef: false,
        utendef: false,
        medut: false,
        utenut: false,
      },
      pos: {
        adj: false,
        adv: false,
        det: false,
        forkorting: false,
        interjeksjon: false,
        konjunksjon: false,
        prefiks: false,
        preposisjon: false,
        pron: false,
        subjunksjon: false,
        subst: false,
        symbol: false,
        verb: false,
      }
    };
  },
  props: {
    adminView: Boolean
  },
  watch: {
    q: _.debounce(function () {
      if (this.q != '' && this.q != '%' && this.q.length > 1) {
        this.sokOppslag()
      }
    }, 200)
  },
  methods: {
    setActiveOppslag (oppslag, index) {
      if (this.currentIndex == index) {
        this.currentIndex = -1
        this.currentOppslag = null
      } else {
        JishoDataService.get(oppslag.lemma_id)
          .then(response => {
            this.currentOppslag = response.data;
          })
          .catch(e => {
            console.log(e);
          })
        this.currentIndex = index;
      }
    },
    async sokOppslag () {
      this.showExpansion = false
      try {
        let string = ""
        Object.keys(this.pos).forEach(ordklasse => {
          string += "&" + ordklasse + "=" + this.pos[ordklasse]
        })
        const response = await JishoDataService.findByOppslag(this.q, this.meduten.meddef,
          this.meduten.utendef, this.meduten.medut, this.meduten.utenut,
          string)
        this.oppslagsliste = response.data;
        this.currentIndex = -1;
        this.currentOppslag = null;
        this.treff = this.oppslagsliste.length
      } catch (error) {
        console.log(error);
      }
    },
    clearSearch () {
      console.log("resfa")
      this.q = 'fsdafas'
    },
    setmeddef () {
      this.meddef = this.meddef ? false : true;
    },
    setutendef () {
      this.utendef = this.utendef ? false : true;
    },
    setmedut () {
      this.medut = this.medut ? false : true;
    },
    setutenut () {
      this.utenut = this.utenut ? false : true;
    },
    setmeduten (varname) {
      this.meduten[varname] = this.meduten[varname] ? false : true;
    },
    setpos (pos) {
      this.pos[pos] = this.pos[pos] ? false : true;
    },
  },
  computed: {
    slicedResults () {
      return this.oppslagsliste.slice(0, 100)
    }
  },
  mounted () {
    if (this.adminView) {
      this.meduten.utendef = true
    }
  }
};
</script>