<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-row no-gutters>
      <v-col
        cols=12
        class="pa-0"
      >
        <v-dialog
          v-model="endre_dialog"
          width="500"
        >
          <v-card>
            <v-card-title>tittel </v-card-title>
            <v-card-text>
              <v-textarea
                v-model="endret_innhold"
                outlined
                counter
                maxlength="1000"
                clearable
                :label="$t('veggen.endre_innlegg')"
                auto-grow
                no-resize
                rows="6"
              ></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red"
                dark
                @click="endre_dialog = false"
              >
                {{ $t('knapper.avbryt') }}
              </v-btn>
              <v-btn
                color="green"
                dark
                @click="endreInnlegg(current_innlegg_id)"
              >
                {{ $t('knapper.oppdater') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card
          max-width="600px"
          class="mx-auto"
        >
          <div v-if="!$route.params.id">

            <v-card-title>
              <span class="my-1">{{$t('navbar.veggen')}}</span>
              <v-spacer></v-spacer>

            </v-card-title>
            <v-card-subtitle>
              {{ $t('veggen.subtitle')}}
            </v-card-subtitle>
          </div>
          <v-card-text>
            <v-textarea
              v-if="!$route.params.id"
              v-model="nytt_innlegg"
              outlined
              counter
              maxlength="1000"
              clearable
              :label="$t('veggen.nytt_innlegg')"
              auto-grow
              no-resize
              rows="6"
            ></v-textarea>

            <v-row
              no-gutters
              justify="end"
            >
              <v-btn
                v-if="nytt_innlegg"
                color="primary"
                @click="postInnlegg(null)"
              >
                {{ $t('veggen.innlegg_knapp')}}
              </v-btn>
            </v-row>
            <div
              v-for="(innlegg) in alle_innlegg"
              v-bind:key="innlegg.innlegg_id"
            >
              <v-card class="mt-5 mb-3">
                <v-card-title
                  class="headline green lighten-3 body-2 pa-3"
                  primary-title
                >
                  <v-avatar
                    :color="randomFarge(innlegg.brukernavn)"
                    size="32"
                  >
                    <span class="white--text">{{ initialer(innlegg.brukernavn) }}</span>
                  </v-avatar>
                  <span class="font-weight-black ml-1"> {{ innlegg.brukernavn}} </span>
                  <v-spacer></v-spacer>

                  <span>{{ new Date(innlegg.opprettet).toLocaleString("da-DK")}}</span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        color="grey darken-3"
                        class="ml-2"
                        v-on="on"
                        @click="fastlenke(innlegg.innlegg_id)"
                      >
                        mdi-link
                      </v-icon>
                    </template>
                    <span>{{ $t('knapper.lenke')}}</span>
                  </v-tooltip>

                  <v-tooltip
                    bottom
                    v-if="$store.getters.user_id == innlegg.user_id"
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon
                        color="grey darken-3"
                        class="ml-2"
                        v-on="on"
                        @click="openEndreDialog(innlegg)"
                      >
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>{{ $t('knapper.endre')}}</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        color="grey darken-3"
                        class="ml-2"
                        v-on="on"
                        @click="handleSvarknapp(innlegg)"
                      >
                        mdi-reply
                      </v-icon>
                    </template>
                    <span>{{ $t('knapper.svar')}}</span>
                  </v-tooltip>
                </v-card-title>
                <v-card-text class="pa-3">
                  <!-- <div class="text--primary">{{ innlegg.innhold}}</div> -->

                  <span v-if="innlegg.endret == true">({{$t('veggen.endret') }})</span>
                  <vue-simple-markdown
                    class="text--primary linjeskift"
                    :source="innlegg.innhold"
                  ></vue-simple-markdown>
                </v-card-text>
              </v-card>
              <v-row no-gutters>
                <v-col cols=1>
                  <v-divider
                    class="mx-4"
                    vertical
                  ></v-divider>
                </v-col>
                <v-col cols=11>
                  <div
                    v-for="(svar) in innlegg.svar"
                    v-bind:key="svar.innlegg_id"
                  >
                    <v-card class="mb-2">
                      <v-card-title
                        class="headline orange lighten-3 body-2 pa-3"
                        primary-title
                      >
                        <v-avatar
                          :color="randomFarge(svar.brukernavn)"
                          size="32"
                        >
                          <span class="white--text">{{ initialer(svar.brukernavn) }}</span>
                        </v-avatar>
                        <span class="font-weight-black ml-1"> {{ svar.brukernavn}} </span>

                        <v-spacer></v-spacer>
                        <span>{{ new Date(svar.opprettet).toLocaleString("da-DK")}}</span>
                        <v-tooltip
                          bottom
                          v-if="$store.getters.user_id == svar.user_id"
                        >
                          <template v-slot:activator="{ on }">
                            <v-icon
                              color="grey darken-3"
                              class="ml-2"
                              v-on="on"
                              @click="openEndreDialog(svar)"
                            >
                              mdi-pencil
                            </v-icon>
                          </template>
                          <span>{{ $t('knapper.endre')}}</span>
                        </v-tooltip>
                      </v-card-title>
                      <v-card-text class="pa-3">
                        <span v-if="svar.endret == true">({{$t('veggen.endret') }})</span>
                        <vue-simple-markdown
                          class="text--primary linjeskift"
                          :source="svar.innhold"
                        ></vue-simple-markdown>
                      </v-card-text>
                    </v-card>
                  </div>
                  <div
                    v-if="svar_id == innlegg.innlegg_id"
                    class="mt-3"
                  >
                    <v-textarea
                      counter
                      maxlength="1000"
                      clearable
                      auto-grow
                      no-resize
                      outlined
                      :label="$t('veggen.svar')"
                      v-model="nytt_svar"
                      rows="4"
                      ref="svarfelt"
                    ></v-textarea>
                    <v-btn
                      class="float-right mt-2"
                      color="primary"
                      @click="postInnlegg(innlegg.innlegg_id)"
                    >
                      {{ $t('veggen.svar_knapp')}}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import JishoDataService from '../services/JishoDataService'
import helpers from '../mixins/helpers'

export default {
  name: "veggen",
  mixins: [helpers],
  data () {
    return {
      alle_innlegg: [],
      nytt_innlegg: '',
      nytt_svar: '',
      endret_innhold: '',
      endre_dialog: '',
      svar_id: Number,
      current_innlegg_id: Number,
      enkeltinnlegg: false
    }
  },
  methods: {
    hentVegginnlegg (innlegg_id) {
      JishoDataService.hentVegginnlegg(innlegg_id)
        .then(response => {
          this.alle_innlegg = response.data
        })
    },
    nullstill () {
      this.nytt_innlegg = ''
      this.nytt_svar = ''
      this.svar_id = null
      this.hentVegginnlegg()
    },
    handleSvarknapp (innlegg) {
      this.svar_id = innlegg.innlegg_id;
      this.$nextTick(() => {
        this.$refs.svarfelt[0].$refs.input.focus()
      })
    },
    fastlenke (innlegg_id) {
      //this.$router.push('/veggen/' + innlegg_id)
      //this.hentVegginnlegg(innlegg_id)
      let url = 'https://baksida.jisho.no/veggen/' + innlegg_id
      navigator.clipboard.writeText(url)
        .then(() => {
          this.$store.dispatch('show_snackbar', { message: this.$t('varsler.kopiert'), color: 'success' })
        })
    },
    openEndreDialog (innlegg) {
      this.endre_dialog = true
      this.current_innlegg_id = innlegg.innlegg_id
      this.endret_innhold = innlegg.innhold.slice()
    },
    endreInnlegg (innlegg_id) {
      JishoDataService.endreVegginnlegg(innlegg_id, { endret_innhold: this.endret_innhold })
        .then((response) => {
          this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
          this.nullstill()
          this.endre_dialog = false
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
        })
    },
    postInnlegg (parent_id) {
      const innhold = parent_id ? this.nytt_svar : this.nytt_innlegg
      console.log(innhold)
      JishoDataService.postVegginnlegg({ parent_id: parent_id, innhold: innhold })
        .then((response) => {
          this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
          this.nullstill()

        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
        })
    },

  },
  mounted () {
    this.hentVegginnlegg(this.$route.params.id)
  }
}
</script>