<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12" class="pa-0">
        <v-card max-width="600px" class="mx-auto">
          <v-card-title class="d-flex align-center">
            {{ $t("oversett.anbefalinger") }}
            <v-spacer></v-spacer>
            <v-btn
              class="d-none d-sm-flex"
              size="small"
              color="primary"
              @click="getAnbefalinger"
            >
              <v-icon size="small" start>mdi-reload</v-icon>
              {{ $t("oversett.hent_flere") }}
            </v-btn>
            <v-btn
              class="d-sm-none"
              icon
              size="x-small"
              color="primary"
              @click="getAnbefalinger"
            >
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            {{ $t("oversett.anbefalinger_title") }}
          </v-card-subtitle>
          <v-card-text align="left">
            <v-table fixed-header density="compact">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">{{ $t("ord.oppslagsord") }}</th>
                    <th class="text-left">{{ $t("ord.ordklasse") }}</th>
                    <th class="text-left">{{ $t("oversett.oversett") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in anbefalinger" :key="item.lemma_id">
                    <td>{{ item.oppslag }}</td>
                    <td>{{ item.boy_tabell }}</td>
                    <td>
                      <router-link :to="'/oppslag/' + item.lemma_id">
                        <v-icon color="green-lighten-1" size="small"> mdi-translate </v-icon>
                      </router-link>
                      <router-link
                        v-if="$store.getters.isAdmin"
                        :to="'/endre/' + item.lemma_id"
                        class="ml-1"
                      >
                        <v-icon color="red" size="small"> mdi-pencil </v-icon>
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-4">
      <v-col cols="12" class="pa-0">
        <v-card max-width="600px" class="mx-auto">
          <v-card-title>
            {{ $t("oversett.requests") }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t("oversett.requests_title") }}
          </v-card-subtitle>
          <v-card-text align="left">
            <v-table fixed-header density="compact">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">{{ $t("ord.oppslagsord") }}</th>
                    <th class="text-left">{{ $t("ord.ordklasse") }}</th>
                    <th class="text-left">{{ $t("oversett.oversett") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in requests" :key="item.lemma_id">
                    <td>{{ item.oppslag }}</td>
                    <td>{{ item.boy_tabell }}</td>
                    <td>
                      <router-link :to="'/oppslag/' + item.lemma_id">
                        <v-icon color="green-lighten-1" size="small"> mdi-translate </v-icon>
                      </router-link>
                      <router-link
                        v-if="$store.getters.isAdmin"
                        :to="'/endre/' + item.lemma_id"
                        class="ml-1"
                      >
                        <v-icon color="red" size="small"> mdi-pencil </v-icon>
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";

import JishoDataService from "../services/JishoDataService";

export default defineComponent({
  data() {
    return {
      tab: null,
      anbefalinger: [],
      requests: [],
    };
  },

  methods: {
    getAnbefalinger() {
      JishoDataService.getAnbefalinger()
        .then((response) => {
          this.anbefalinger = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
    getRequests() {
      JishoDataService.getRequests()
        .then((response) => {
          this.requests = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.$store.dispatch("show_snackbar", {
            message: error.response.data,
            color: "error",
          });
        });
    },
  },

  mounted() {
    this.getAnbefalinger();
    this.getRequests();
  },
});
</script>
