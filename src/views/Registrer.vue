<template>
  <v-card
    max-width="600px"
    class="mt-10 mx-auto"
  >
    <v-card-title class="font-weight-bold">
      {{ $t('bruker.registrering.registrer_deg') }}
    </v-card-title>
    <v-card-subtitle>
      {{ $t('bruker.registrering.registrer_undertittel') }}
    </v-card-subtitle>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          :label="$t('bruker.brukernavn')"
          v-model="username"
          outlined
          :rules="username_rules"
          required
        />
        <v-text-field
          type="email"
          :label="$t('bruker.epost')"
          v-model="email"
          :rules="email_rules"
          outlined
          required
        />
        <v-text-field
          :type="showPassword ? 'text' : 'password'"
          :label="$t('bruker.passord')"
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          :rules="password_rules"
          outlined
          required
        />
        <v-text-field
          :type="showPasswordConfirmed ? 'text' : 'password'"
          :label="$t('bruker.registrering.bekreft_passord')"
          v-model="password_confirm"
          :append-icon="showPasswordConfirmed ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPasswordConfirmed = !showPasswordConfirmed"
          :rules="password_confirm_rules"
          outlined
          required
          @keyup.enter="register"
        />
        <v-text-field
          :label="$t('bruker.registrering.sjekk')"
          v-model="check"
          outlined
          :rules="check_rules"
          required
        />
      </v-form>
      <v-alert
        v-if="error_message"
        outlined
        type="error"
      >
        {{ this.error_message}}
      </v-alert>
      <v-alert
        v-if="success_message"
        outlined
        type="success"
      >
        {{ this.success_message }}
      </v-alert>
    </v-card-text>
    <v-card-actions class="justify-center pb-6">
      <v-btn
        type="submit"
        color="accent"
        @click="register"
        :disabled="!valid"
      > {{ $t('bruker.registrering.registrer_knapp') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import JishoDataService from '../services/JishoDataService'

export default {
  name: 'Registrer',
  data () {
    return {
      valid: false,
      showPassword: false,
      showPasswordConfirmed: false,
      email: '',
      email_rules: [
        v => !!v || this.$t('bruker.registrering.error_epost'),
        v => (v && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)) || this.$t('bruker.registrering.error_epost_gyldig'),
      ],
      username: '',
      username_rules: [
        v => !!v || this.$t('bruker.registrering.error_brukernavn'),
        v => (v && v.length > 5 && v.length < 13) || this.$t('bruker.registrering.error_brukernavn_lengde'),
        v => (v && /^[a-zæøå]+$/.test(v)) || this.$t('bruker.registrering.error_brukernavn_gyldig'),
      ],

      password: '',
      password_rules: [
        v => (v && v.length > 5) || this.$t('bruker.registrering.error_passord')
      ],
      password_confirm: '',
      password_confirm_rules: [
        v => !!v || this.$t('bruker.registrering.error_bekreft_passord'),
        v => (v && v == this.password) || this.$t('bruker.registrering.error_bekreft_ulikt')
      ],
      check: '',
      check_rules: [
        v => (!!v) || this.$t('bruker.registrering.error_sjekk'),
      ],
      error_message: '',
      success_message: '',
    }
  },
  methods: {
    register: function () {
      if (this.$refs.form.validate()) {
        const user_data = {
          email: this.email,
          username: this.username,
          password: this.password,
          check: this.check
        }
        this.error_message = ''
        JishoDataService.registrer(user_data)
          .then((response) => {
            this.success_message = response.data
            setTimeout(() => {
              this.$router.push('logginn')
            }, 2000)
          })
          .catch(error => {
            console.log(error)
            this.error_message = error.response.data
          })
      }
    },
    clear () {
      this.$refs.form.reset()
    }

  },
}

</script>