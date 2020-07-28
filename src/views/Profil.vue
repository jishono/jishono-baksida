<template>
  <v-container class="pa-0">
    <v-row no-gutters>
      <v-col
        align="center"
        cols=12
        class="pa-0"
      >
        <v-card max-width='600px'>
          <v-card-title class="font-weight-bold">
            Profil
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                label="Brukernavn"
                v-model="brukerdata.brukernavn"
                outlined
                disabled
              />
              <v-text-field
                type="email"
                label="E-post"
                v-model="brukerdata.epost"
                :rules="epostRules"
                outlined
              />
              <v-text-field
                type="password"
                label="Gammelt passord"
                v-model="passord.gammelt"
                :rules="oldPasswordRules"
                outlined
              />
              <v-text-field
                type="password"
                label="Nytt passord"
                v-model="passord.nytt"
                outlined
              />
              <v-text-field
                type="password"
                label="Bekreft passord"
                v-model="passord.nyttBekreft"
                outlined
              />

            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center pb-6">
            <v-btn
              color="primary"
              @click="sjekkSkjema"
              :disabled="!valid"
            >
              Oppdater
            </v-btn>
          </v-card-actions>
        </v-card>
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
      tab: 0,
      valid: false,
      brukerdata: {},
      brukerforslag: [],
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
            this.setSnackbar(error.response.data, 'error')
          }
        })
    },
    sjekkSkjema () {
      if (this.passord.nytt != '') {
        if (this.passord.nytt === this.passord.nyttBekreft) {
          console.log("like passord")
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
        nytt_passord: this.passord.nytt
      })
        .then((response) => {
          this.getBrukerdata()
          const message = response.data
          this.$store.dispatch('show_snackbar', { message: message, color: 'success' })
          this.passord.nytt = ''
          this.passord.nyttBekreft = ''
        })
        .catch(error => {
          console.log(error)
          const message = error.response.data
          this.$store.dispatch('show_snackbar', { message: message, color: 'error' })
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
    getBrukerforslag () {
      const user_id = this.$store.getters.user_id
      JishoDataService.getBrukerforslag(user_id)
        .then(res => {
          this.brukerforslag = res.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  computed: {
  },
  mounted () {
    this.getBrukerdata()
    this.getBrukerforslag()
  }
}

</script>