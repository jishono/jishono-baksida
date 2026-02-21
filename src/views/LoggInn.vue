<template>
  <v-card max-width="400px" class="mt-10 mx-auto">
    <v-card-title class="font-weight-bold">
      {{ $t("navbar.logg_inn") }}
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          :label="$t('bruker.brukernavn')"
          prepend-icon="mdi-account-circle"
          v-model="username"
          :rules="username_rules"
          required
          autofocus
        />
        <v-text-field
          :type="showPassword ? 'text' : 'password'"
          :label="$t('bruker.passord')"
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
    <v-alert v-if="error_message" density="compact" variant="outlined" type="error">
      {{ this.error_message }}
    </v-alert>
    <v-card-actions class="justify-center pb-6">
      <v-btn color="primary" @click="login" :disabled="!valid">
        {{ $t("navbar.logg_inn") }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { defineComponent } from "vue";

import JishoDataService from "../services/JishoDataService";

export default defineComponent({
  name: "logg-inn",

  data() {
    return {
      message: "",
      valid: false,
      showPassword: false,
      username: "",
      username_rules: [
        (v) => !!v || this.$t("bruker.logg_inn.error_brukernavn"),
      ],
      password: "",
      password_rules: [(v) => !!v || this.$t("bruker.logg_inn.error_passord")],
      error_message: "",
    };
  },

  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          const username = this.username;
          const password = this.password;
          await this.$store.dispatch("login", { username, password });
          await JishoDataService.updateLastSeen(this.$store.getters.user_id);
          this.$router.push("/");
        } catch (error) {
          console.log(error.response.data);
          this.error_message = error.response.data[this.$i18n.locale];
          console.log(error);
        }
      }
    },
    validate() {
      this.$refs.form.validate();
    },
  },
});
</script>
