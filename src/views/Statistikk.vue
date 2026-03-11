<template>
  <v-container>
    <v-row no-gutters justify="center">
      <v-col lg="9" cols="12">
        <v-card class="ma-2">
          <v-card-title>
            {{ $t("statistikk.diverse") }}
          </v-card-title>
          <v-card-text v-if="oppslag_info_sorted">
            <v-table density="compact">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">{{ $t("statistikk.type") }}</th>
                    <th class="text-left">{{ $t("statistikk.antall") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in oppslag_info_sorted"
                    :key="item.tittel"
                  >
                    <td>{{ $t("statistikk." + item.tittel) }}</td>
                    <td>{{ item.antall }}</td>
                  </tr>
                </tbody>
              </template>
            </v-table>
          </v-card-text>
          <v-card-text v-else class="text-center">
            <v-progress-circular size="30" color="primary" indeterminate />
          </v-card-text>
        </v-card>
        <v-card class="ma-2" height="450">
          <v-card-title> {{ $t("statistikk.siste_30") }}</v-card-title>
          <line-chart
            v-if="nye_oversettelser && nye_forslag && antall_kommentarer"
            v-bind:nye_oversettelser="nye_oversettelser"
            v-bind:nye_forslag="nye_forslag"
            v-bind:antall_kommentarer="antall_kommentarer"
          >
          </line-chart>
          <v-card-text v-else class="text-center">
            <v-progress-circular size="30" color="primary" indeterminate />
          </v-card-text>
        </v-card>
        <v-card class="ma-2" height="450">
          <v-card-title>
            {{ $t("statistikk.ord_med_oversettelser") }}</v-card-title
          >
          <line-chart-history
            v-if="translated_by_day"
            v-bind:WordsWithTranslations="translated_by_day"
          >
          </line-chart-history>
          <v-card-text v-else class="text-center">
            <v-progress-circular size="30" color="primary" indeterminate />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col lg="3" cols="12">
        <v-card class="ma-2">
          <v-card-title>
            {{ $t("statistikk.brukere") }}
          </v-card-title>
          <v-card-text v-if="brukeroversettelser">
            <v-table density="compact">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">{{ $t("bruker.brukernavn") }}</th>
                    <th class="text-left">
                      {{ $t("statistikk.oversettelser") }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in brukeroversettelser"
                    :key="item.brukernavn"
                  >
                    <td>{{ item.brukernavn }}</td>
                    <td>{{ item.antall_oversettelser }}</td>
                  </tr>
                </tbody>
              </template>
            </v-table>
          </v-card-text>
          <v-card-text v-else class="text-center">
            <v-progress-circular size="30" color="primary" indeterminate />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";

import LineChart from "../components/LineChart.vue";
import LineChartHistory from "../components/LineChartHistory.vue";
import JishoDataService from "../services/JishoDataService";

export default defineComponent({
  name: "statistikk",

  data() {
    return {
      brukeroversettelser: null,
      oppslag_info: null,
      nye_oversettelser: null,
      nye_forslag: null,
      antall_kommentarer: null,
      translated_by_day: null,
    };
  },

  components: {
    LineChart,
    LineChartHistory,
  },

  computed: {
    oppslag_info_sorted() {
      if (!this.oppslag_info) return null;
      return [...this.oppslag_info].sort((a, b) =>
        a.tittel === "ord_med" ? -1 : b.tittel === "ord_med" ? 1 : 0
      );
    },
  },

  methods: {},

  mounted() {
    JishoDataService.getBrukeroversettelser()
      .then((response) => { this.brukeroversettelser = response.data; })
      .catch((error) => { console.log(error); });

    JishoDataService.getOppslagInfo()
      .then((response) => { this.oppslag_info = response.data; })
      .catch((error) => { console.log(error); });

    JishoDataService.getNyeOversettelser()
      .then((response) => { this.nye_oversettelser = response.data; })
      .catch((error) => { console.log(error); });

    JishoDataService.getNyeForslag()
      .then((response) => { this.nye_forslag = response.data; })
      .catch((error) => { console.log(error); });

    JishoDataService.getAntallKommentarer()
      .then((response) => { this.antall_kommentarer = response.data; })
      .catch((error) => { console.log(error); });

    JishoDataService.getTranslatedByDay()
      .then((response) => { this.translated_by_day = response.data; })
      .catch((error) => { console.log(error); });
  },
});
</script>
