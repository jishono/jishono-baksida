<template>
  <v-container v-if="$store.getters.isAdmin">
    <v-row v-if="total" no-gutters class="mb-6" style="gap: 16px;">
      <v-col cols="auto">
        <v-card variant="tonal" color="primary" rounded="lg" min-width="160">
          <v-card-text class="pa-4">
            <div class="d-flex align-center mb-1" style="gap: 6px;">
              <v-icon size="16" color="primary">mdi-eye-outline</v-icon>
              <span class="text-caption text-uppercase font-weight-bold" style="letter-spacing: 0.08em;">Sidevisninger</span>
            </div>
            <div class="text-h5 font-weight-bold">{{ total.visits.toLocaleString('nb-NO') }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="auto">
        <v-card variant="tonal" color="primary" rounded="lg" min-width="160">
          <v-card-text class="pa-4">
            <div class="d-flex align-center mb-1" style="gap: 6px;">
              <v-icon size="16" color="primary">mdi-account-multiple-outline</v-icon>
              <span class="text-caption text-uppercase font-weight-bold" style="letter-spacing: 0.08em;">Unike besøkende</span>
            </div>
            <div class="text-h5 font-weight-bold">{{ total.unique_visitors.toLocaleString('nb-NO') }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="visits"
          :header-props="{ sortIcon: null }"
          density="compact"
          :items-per-page="50"
        >
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue';

import JishoDataService from '../services/JishoDataService';

export default defineComponent({
  name: 'visits',

  data() {
    return {
      visits: [],
      total: null,
      headers: [
        { title: 'Dato', key: 'dato', width: '1%', align: 'start' },
        { title: 'Sidevisninger', key: 'antall', width: '10%' },
        { title: 'Unike besøkende', key: 'unique_visitors', width: '10%' },
      ],
    };
  },

  methods: {
    getPageVisits() {
      JishoDataService.getPageVisits().then(response => {
        this.visits = response.data.by_date;
        this.total = response.data.total;
      });
    },
  },

  mounted() {
    this.getPageVisits();
  },
});
</script>
