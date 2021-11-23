<template>
  <v-container v-if="$store.getters.isAdmin">
    <v-row no-gutters>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="visits"
          :header-props="{ sortIcon: null }"
          dense
          :options="{
            itemsPerPage: 50
          }"
        >
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>

</template>


<script>
import JishoDataService from '../services/JishoDataService'

export default {
  name: 'visits',
  data () {
    return {
      visits: [],
      headers: [
        { text: "Dato", value: 'dato', width: '1%', align: "start" },
        { text: "Sidevisninger", value: 'antall', width: '10%' },
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
  }
}
</script>