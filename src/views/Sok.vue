<template>
  <v-container
    fluid
    class="pa-0 mx-0"
  >
    <Boyningstabell
      v-if="currentOppslag && $store.getters.boy_ok.includes(currentOppslag.boy_tabell) "
      v-bind:lemma_id="currentOppslag.lemma_id"
      :boyningsDialog.sync="boyningsDialog"
      @outside_click="boyningsDialog = false"
    />
    <v-row
      align="center"
      justify="center"
      no-gutters
    >
      <v-col
        sm=8
        cols=12
        class="px-2"
      >
        <v-text-field
          v-model="q"
          rounded
          solo
          hide-details
          :label="$t('sok.sokefelt')"
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
    <v-row
      no-gutters
      class="mt-5"
    >
      <v-col
        class="hidden-xs-only"
        cols=2
      ></v-col>
      <v-col
        sm=6
        cols=12
        align="left"
      >
        <div class="font-weight-bold py-2 float-left ml-3">
          <span>{{ $t('sok.treff') }}:</span>
          <v-progress-circular
            v-if="isLoading"
            class="ml-2"
            size="20"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <span v-else> {{ this.treff}}</span>
        </div>
        <div>
          <span
            class="float-right text-caption"
            v-if="oppslagsliste.length > 0"
          >
            <v-btn
              icon
              color="primary"
              @click="changePage('ned')"
            >
              <v-icon>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            {{ this.currentlyShowing}}

            <v-btn
              icon
              color="primary"
              @click="changePage('opp')"
            >
              <v-icon>
                mdi-chevron-right
              </v-icon>
            </v-btn>
          </span>
        </div>
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
                <span class="font-weight-bold"> {{ $t('ord.lemma_id') }}: </span> {{ currentOppslag.lemma_id }} <br>
                <span class="font-weight-bold"> {{ $t('ord.ledd') }}: </span> {{ currentOppslag.ledd }} <br>
                <span class="font-weight-bold"> {{ $t('ord.uttale') }}: </span>
                <span
                  v-for="(ut) in currentOppslag.uttale"
                  v-bind:key="ut.transkripsjon"
                >
                  / {{ ut.transkripsjon }} /
                </span>
                <br>
                <span class="font-weight-bold"> {{ $t('ord.definisjoner') }}: </span><br>
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
                    <v-btn
                      small
                      color="primary"
                      @click="boyningsDialog = true"
                    >
                      {{ $t('knapper.vis_boyning') }}
                    </v-btn>
                  </div>
                  <v-btn
                    v-if="$store.getters.isAdmin"
                    class="ml-2"
                    small
                    dark
                    color="accent"
                    :to="'/endre/' + currentOppslag.lemma_id"
                  >{{ $t('knapper.endre') }}</v-btn>
                  <v-btn
                    class="ml-2"
                    small
                    dark
                    color="green"
                    :to="'/nytt_forslag/' + currentOppslag.lemma_id"
                  >{{ $t('knapper.foreslå') }}</v-btn>
                </v-card-actions>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <div
          class="text-center mt-3"
          v-if="showNewWordButton"
        >
          <v-btn
            class="primary"
            :to="'/nytt_oppslag/' + this.q"
            style="text-transform: none"
          >
            <span>
              {{ $t('knapper.new_word') }}: '{{q}}'
            </span>
          </v-btn>
        </div>
      </v-col>
      <v-col
        cols=3
        class="hidden-xs-only pl-4"
        align="left"
      >
        <h4>{{ $t('sok.filter') }}</h4>
        <v-checkbox
          class="pa-0 ma-0"
          :label="$t('sok.med_def')"
          hide-details
          v-model="meduten.meddef"
          @click.native="sokOppslag()"
        >
        </v-checkbox>
        <v-checkbox
          class="pa-0 ma-0"
          hide-details
          :label="$t('sok.uten_def')"
          v-model="meduten.utendef"
          @click.native="sokOppslag()"
        >
        </v-checkbox>
        <v-checkbox
          class="pa-0 ma-0"
          hide-details
          :label="$t('sok.med_uttale')"
          v-model="meduten.medut"
          @click.native="sokOppslag()"
        >
        </v-checkbox>
        <v-checkbox
          class="pa-0 ma-0"
          hide-details
          :label="$t('sok.uten_uttale')"
          v-model="meduten.utenut"
          @click.native="sokOppslag()"
        >
        </v-checkbox>
        <v-checkbox
          class="pa-0 ma-0"
          hide-details
          :label="$t('sok.kun_wiki')"
          v-model="meduten.kunwiki"
          @click.native="sokOppslag()"
        >
        </v-checkbox>
        <v-checkbox
          class="pa-0 ma-0"
          hide-details
          :label="$t('sok.uten_wiki')"
          v-model="meduten.utenwiki"
          @click.native="sokOppslag()"
        >
        </v-checkbox>
        <v-checkbox
          v-if="$store.getters.isAdmin"
          class="pa-0 ma-0"
          hide-details
          label="kun skjulte"
          v-model="kun_skjult"
          @click.native="sokOppslag()"
        >
        </v-checkbox>
        <h5 class="mt-3">{{ $t('ord.ordklasse') }}</h5>
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
import Boyningstabell from "../components/Boyningstabell.vue";
import _ from 'lodash';

export default {
  name: "Sok",
  components: {
    Boyningstabell,
  },
  data () {
    return {
      oppslagsliste: [],
      showExpansion: false,
      showNewWordButton: false,
      currentOppslag: null,
      currentIndex: -1,
      tabellSynlig: false,
      isLoading: false,
      q: "",
      treff: null,
      side: 0,
      treffPerSide: 20,
      boyningsDialog: false,
      kun_skjult: false,
      meduten: {
        meddef: false,
        utendef: false,
        medut: false,
        utenut: false,
        kunwiki: false,
        utenwiki: false,
      },
      pos: {
        adj: false,
        adv: false,
        det: false,
        egennavn: false,
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
      this.showNewWordButton = false
      if (this.q != '' && this.q != '%' && this.q.length > 0) {
        window.history.replaceState({}, document.title, '/sok/' + this.q);
        this.sokOppslag()
      } else {
        this.$router.replace('/sok/', () => { })
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
      this.isLoading = true
      this.showExpansion = false
      try {
        let string = ""
        Object.keys(this.pos).forEach(ordklasse => {
          string += "&" + ordklasse + "=" + this.pos[ordklasse]
        })
        const response = await JishoDataService.findByOppslag(this.q, this.meduten.meddef,
          this.meduten.utendef, this.meduten.medut, this.meduten.utenut, this.meduten.kunwiki, this.meduten.utenwiki, this.kun_skjult,
          string)
        this.oppslagsliste = response.data
        this.isLoading = false
        this.currentIndex = -1
        this.currentOppslag = null
        this.treff = this.oppslagsliste.length
        this.side = 0
        if (!this.oppslagsliste.map(result => result.oppslag).includes(this.q) && this.q != '') {
          this.showNewWordButton = true
        }
      } catch (error) {
        this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
        console.log(error);
      }
    },
    changePage (retning) {
      if (retning === 'ned') {
        if (this.side > 0) {
          this.side -= 1
        }
      }
      else if (retning === 'opp') {
        if (this.side < Math.ceil(this.treff / this.side) &&
          (this.side * this.treffPerSide + this.treffPerSide) < this.treff) {
          this.side += 1
        }
      }
      this.currentIndex = -1
      this.currentOppslag = null
      this.showExpansion = false
    }
  },
  computed: {
    slicedResults () {
      let current = this.side * this.treffPerSide
      return this.oppslagsliste.slice(current, current + this.treffPerSide)
    },
    currentlyShowing () {
      const current = this.side * this.treffPerSide
      const lower = current + 1
      const upper = (current + this.treffPerSide < this.treff) ? current + this.treffPerSide : this.treff

      return lower + ' - ' + upper
    }
  },
  mounted () {
    this.q = this.$route.params.query || ''
    if (!this.$store.getters.isAdmin) {
      this.meduten.utendef = true
    }
  }
};
</script>