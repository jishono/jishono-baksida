<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          max-width="400px"
          class="mt-10 mx-auto"
        >
          <v-card-title class="pb-3">
            <h2>Logg inn</h2>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                label="Brukernavn"
                prepend-icon="mdi-account-circle"
                v-model="username"
                :rules="username_rules"
                required
                autofocus
              />
              <v-text-field
                :type="showPassword ? 'text' : 'password'"
                label="Passord"
                v-model="password"
                :rules="password_rules"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                @keyup.enter="login"
                required
              />
            </v-form>
          </v-card-text>
          <v-alert
            v-if="errormessage"
            dense
            outlined
            type="error"
          >
            {{ this.errormessage}}
          </v-alert>
          <v-card-actions class="justify-center pb-6">
            <v-btn
              color="primary"
              @click="login"
              :disabled="!valid"
            >Logg inn</v-btn>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  data () {
    return {
      message: '',
      valid: false,
      showPassword: false,
      username: '',
      username_rules: [
        v => !!v || 'Skriv brukernavnet ditt'
      ],
      password: '',
      password_rules: [
        v => !!v || 'Skriv passordet ditt'
      ],
      errormessage: ''
    }
  },
  methods: {
    async login () {
      if (this.$refs.form.validate()) {
        try {
          const username = this.username
          const password = this.password
          await this.$store.dispatch('login', { username, password })
          console.log(this.$route.params.nextUrl)
          this.$router.push('/oversikt')
        } catch (error) {
          this.message = "Feil brukernavn eller passord"
          console.log(error)
        }
      }
    },
    validate () {
      this.$refs.form.validate()
    },
  }
}
</script>