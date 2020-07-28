<template>
  <v-card
    max-width="600px"
    class="mt-10 mx-auto"
  >
    <v-card-title class="font-weight-bold">
      Registrer deg
    </v-card-title>
    <v-card-subtitle>
      Lag en bruker for å kunne oversette nye ord
    </v-card-subtitle>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          label="Brukernavn"
          v-model="username"
          outlined
          :rules="username_rules"
          required
        />
        <v-text-field
          type="email"
          label="E-post"
          v-model="email"
          :rules="email_rules"
          outlined
          required
        />
        <v-text-field
          :type="showPassword ? 'text' : 'password'"
          label="Passord"
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          :rules="password_rules"
          outlined
          required
        />
        <v-text-field
          :type="showPasswordConfirmed ? 'text' : 'password'"
          label="Bekreft passord"
          v-model="password_confirm"
          :append-icon="showPasswordConfirmed ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPasswordConfirmed = !showPasswordConfirmed"
          :rules="password_confirm_rules"
          outlined
          required
          @keyup.enter="register"
        />
        <v-text-field
          label="Hva er fem pluss seks? Bruk bokstaver"
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
      >Registrer ny bruker</v-btn>
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
        v => !!v || 'Du må skrive e-posten din',

        v => (v && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)) || 'Adressen må være gyldig',
      ],
      username: '',
      username_rules: [
        v => !!v || 'Du må skrive et brukernavn',
        v => (v && v.length > 5 && v.length < 13) || 'Brukernavnet må mellom 6 og 12 tegn eller lengre'
      ],

      password: '',
      password_rules: [
        v => (v && v.length > 5) || 'Passordet må være 6 tegn eller lengre'
      ],
      password_confirm: '',
      password_confirm_rules: [
        v => !!v || 'Gjenta passordet over',
        v => (v && v == this.password) || 'Begge passordfeltene må være helt like'
      ],
      check: '',
      check_rules: [
        v => (!!v) || 'Du må svare riktig på dette',
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
        JishoDataService.registrer(user_data)
          .then((response) => {
            this.error_message = ''
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