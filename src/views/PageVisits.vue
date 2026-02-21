<template>
  <v-container v-if="$store.getters.isAdmin">
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

import JishoDataService from '../services/JishoDataService'

export default defineComponent({
  name: 'visits',

  data () {
    return {
      visits: [],
      headers: [
        { title: "Dato", key: 'dato', width: '1%', align: "start" },
        { title: "Sidevisninger", key: 'antall', width: '10%' },
      ]
    }
  },

  methods: {
    getPageVisits () {
      JishoDataService.getPageVisits()
        .then((response) => {
          this.visits = response.data.reverse()
        })
    }
  },

  mounted () {
    this.getPageVisits()
  },
});
</script>