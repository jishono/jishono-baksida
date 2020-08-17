<template>
  <v-container class="pa-0">
    <v-row no-gutters>
      <v-col>
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <v-card>

            <v-card-title>
              Bekreft
            </v-card-title>

            <v-card-text>
              <v-text-field
                type="password"
                :label="$t('bruker.profil.gammelt_passord')"
                v-model="passord.gammelt"
                :rules="oldPasswordRules"
                @keyup.enter="dialog = false; sjekkSkjema()"
                outlined
                autofocus
              />
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="dialog = false; sjekkSkjema()"
              >
                Godkjenn
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-row no-gutters>
          <v-col>
            <v-card
              max-width='600px'
              class="mx-auto"
              v-if="brukerdata"
            >
              <v-card-text>
                <h2 class="mb-3">
                  {{ $t('navbar.profil') }}
                </h2>
                <v-form
                  ref="form"
                  v-model="valid_profile"
                >
                  <v-text-field
                    :label="$t('bruker.brukernavn')"
                    v-model="brukerdata.brukernavn"
                    outlined
                    disabled
                  />
                  <v-text-field
                    type="email"
                    :label="$t('bruker.epost')"
                    v-model="brukerdata.epost"
                    :rules="epostRules"
                    outlined
                  />
                  <v-select
                    v-model="brukerdata.locale"
                    :label="$t('bruker.profil.visningsspråk')"
                    :items="sprakvalg"
                    item-value='value'
                    item-text='text'
                    outlined
                  ></v-select>
                  <h2 class="mb-3">
                    {{ $t('bruker.profil.endre_passord')}}
                  </h2>
                  <v-text-field
                    type="password"
                    :label="$t('bruker.profil.nytt_passord')"
                    v-model="passord.nytt"
                    outlined
                  />
                  <v-text-field
                    type="password"
                    :label="$t('bruker.registrering.bekreft_passord')"
                    v-model="passord.nyttBekreft"
                    outlined
                  />
                </v-form>
                <h2 class="mb-3">
                  {{ $t('bruker.profil.oppdateringer')}}
                </h2>
                <span>  {{ $t('bruker.profil.aktivitetsoppsummering')}}</span>
                <v-row class="ml-1">
                  <v-radio-group
                    v-model="brukerdata.oppdateringer.opp_periode"
                    row
                  >
                    <v-radio
                      :label="$t('bruker.profil.aldri')"
                      :value=0
                    ></v-radio>
                    <v-radio
                      :label="$t('bruker.profil.daglig')"
                      :value=1
                    ></v-radio>
                    <v-radio
                      :label="$t('bruker.profil.hver_uke')"
                      :value=7
                    ></v-radio>
                    <v-radio
                      :label="$t('bruker.profil.annenhver_uke')"
                      :value=14
                    ></v-radio>
                  </v-radio-group>
                </v-row>

                <span> {{ $t('bruker.profil.hendelser')}}</span>
                <v-checkbox
                  hide-details
                  :label="$t('bruker.profil.kommenterer_forslag')"
                  v-model="brukerdata.oppdateringer.opp_kommentar_eget"
                >

                </v-checkbox>
                <v-checkbox
                  hide-details
                  :label="$t('bruker.profil.svarer_kommentar_innlegg')"
                  v-model="brukerdata.oppdateringer.opp_svar"
                >
                </v-checkbox>
              </v-card-text>
              <v-card-actions class="justify-center pb-6">
                <v-btn
                  color="primary"
                  @click="dialog = true"
                  :disabled="!valid_profile"
                >
                  {{ $t('knapper.oppdater') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import JishoDataService from '../services/JishoDataService'

export default {
  name: 'profil',
  data () {
    return {
      dialog: false,
      valid_profile: false,
      brukerdata: null,
      sprakvalg: [
        { value: 'no', text: 'Norsk' },
        { value: 'ja', text: '日本語' }
      ],
      passord: {
        gammelt: '',
        nytt: '',
        nyttBekreft: ''
      },
      oldPasswordRules: [
        v => !!v || 'Du må skrive passordet ditt for å gjøre endringer',
      ],
      /*       passwordRules: [
              v => (v && v.length > 5) || 'Passordet må være 6 tegn eller lengre'
            ],
            passwordConfirmRules: [
              v => (v && v == this.passord.nytt) || 'Begge passordfeltene må være helt like'
            ], */
      epostRules: [
        v => !!v || 'Du må skrive e-posten din',

        v => (v && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)) || 'Adressen må være gyldig',
      ],
      search: '',
      headers: [
        {
          text: 'Oppslagsord',
          align: 'start',
          value: 'oppslag',
          width: '15%'
        },
        { text: 'Ordklasse', value: 'boy_tabell', width: '10%' },
        { text: 'Forslag til definisjon', value: 'forslag_definisjon', width: '30%' },
        { text: 'Stemmer', value: 'stemmer', width: '20%' },
        { text: 'Status', value: 'status', width: '15%' },
        { text: 'Dato', value: 'opprettet', width: '15%' },
      ],
    }
  },
  methods: {
    fjernForslag (item) {
      JishoDataService.fjernForslag(item.forslag_id)
        .then((response) => {
          this.setSnackbar(response.data, 'success')
          this.refresh()
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
          }
        })
    },
    sjekkSkjema () {
      if (this.passord.nytt != '') {
        if (this.passord.nytt === this.passord.nyttBekreft) {
          this.oppdaterBrukerdata()
        } else {
          this.$store.dispatch('show_snackbar', { message: 'Passordene må være like', color: 'error' })
        }
      } else {
        console.log(this.passord.nytt)
        this.oppdaterBrukerdata()
      }
    },
    oppdaterBrukerdata () {
      const user_id = this.$store.getters.user_id
      JishoDataService.updateBrukerdata(user_id, {
        epost: this.brukerdata.epost,
        gammelt_passord: this.passord.gammelt,
        nytt_passord: this.passord.nytt,
        locale: this.brukerdata.locale,
        oppdateringer: this.brukerdata.oppdateringer
      })
        .then((response) => {
          this.getBrukerdata()
          const message = response.data
          this.$store.dispatch('show_snackbar', { message: message, color: 'success' })
          this.$store.dispatch('set_locale', this.brukerdata.locale)
          this.$refs.form.reset()
          this.passord.nytt = ''
          this.passord.nyttBekreft = ''
          this.passord.gammelt = ''
        })
        .catch(error => {
          console.log(error)
          const message = error.response.data
          this.$store.dispatch('show_snackbar', { message: message, color: 'error' })
          this.passord.gammelt = ''
        })

    },
    getBrukerdata () {
      const user_id = this.$store.getters.user_id
      JishoDataService.getBruker(user_id)
        .then(res => {
          this.brukerdata = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
  },
  computed: {
  },
  mounted () {
    this.getBrukerdata()
  }
}

</script>