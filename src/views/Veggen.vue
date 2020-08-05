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
        <v-card
          max-width="600px"
          class="mx-auto"
        >
          <v-card-title>
            <span class="my-1">{{$t('navbar.veggen')}}</span>
            <v-spacer></v-spacer>
            <v-btn
              v-if="nytt_innlegg"
              color="primary"
              @click="postInnlegg(null)"
            >
              {{ $t('veggen.innlegg_knapp')}}
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            {{ $t('veggen.subtitle')}}
          </v-card-subtitle>
          <v-card-text>
            <v-textarea
              outlined
              counter
              maxlength="1000"
              clearable
              :label="$t('veggen.nytt_innlegg')"
              v-model="nytt_innlegg"
              auto-grow
              no-resize
              rows="6"
            ></v-textarea>
            <v-row
              no-gutters
              justify="end"
            >
            </v-row>
            <div
              v-for="(innlegg) in alle_innlegg"
              v-bind:key="innlegg.innlegg_id"
            >
              <v-card class="mt-5 mb-3">
                <v-card-title
                  class="headline green lighten-3 body-2 pa-0"
                  primary-title
                >
                  <v-col cols=5>
                    <span class="font-weight-black"> {{ innlegg.brukernavn}} </span>
                  </v-col>
                  <v-col align="end">
                    {{ new Date(innlegg.opprettet).toLocaleString("da-DK")}}

                    <v-icon
                      color="black"
                      class="ml-2"
                      @click="handleSvarknapp(innlegg)"
                    >
                      mdi-reply
                    </v-icon>
                  </v-col>
                </v-card-title>
                <v-card-text class="pa-3">
                  <div class="text--primary">{{ innlegg.innhold}}</div>
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
                        class="headline orange lighten-3 body-2 pa-0"
                        primary-title
                      >
                        <v-col cols=5>
                          <span class="font-weight-black"> {{ svar.brukernavn}} </span>
                        </v-col>
                        <v-col align="end">
                          {{ new Date(svar.opprettet).toLocaleString("da-DK")}}
                        </v-col>
                      </v-card-title>
                      <v-card-text class="pa-3">
                        <div
                          v-html="svar.innhold"
                          class="text--primary"
                        ></div>
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

export default {
  name: "veggen",
  data () {
    return {
      alle_innlegg: [],
      nytt_innlegg: '',
      nytt_svar: '',
      svar_id: Number
    }
  },
  methods: {
    getAlleInnlegg () {
      JishoDataService.getAlleVegginnlegg()
        .then(response => {
          this.alle_innlegg = response.data
        })
    },
    handleSvarknapp (innlegg) {
      this.svar_id = innlegg.innlegg_id;
      this.$nextTick(() => {
        this.$refs.svarfelt[0].$refs.input.focus()
      })
    },
    postInnlegg (parent_id) {
      const innhold = parent_id ? this.nytt_svar : this.nytt_innlegg
      console.log(innhold)
      JishoDataService.postVegginnlegg({ parent_id: parent_id, innhold: innhold })
        .then((response) => {
          this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
          this.getAlleInnlegg()
          this.nytt_innlegg = ''
          this.nytt_svar = ''
          this.svar_id = null
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
        })
    }
  },
  mounted () {
    this.getAlleInnlegg()
  }
}
</script>
