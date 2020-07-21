<template>
  <v-container>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="snackbarColor"
      top
    >
      {{ snackbarMessage}}
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :items="forslag"
      :items-per-page="50"
      class="elevation-1"
    >
      <template v-slot:item.stemmer="{ item }">

        <v-chip
          color="green lighten-1"
          text-color="white"
          small
          @click="stemForslag(item, 1)"
        >
          <span class="mr-2">
            {{ item.upvotes}}
          </span>
          <v-icon
            small
            dark
          >
            mdi-thumb-up-outline
          </v-icon>
        </v-chip>
        
        <v-chip
          class="ma-1"
          color="red lighten-1"
          text-color="white"
          small
          @click="stemForslag(item, 0)"
        >
          <span class="mr-2">
            {{ item.downvotes}}
          </span>
          <v-icon
            small
            dark
          >
            mdi-thumb-down-outline
          </v-icon>
        </v-chip>
      </template>

      <template v-slot:item.opprettet="{ item }">
        {{ new Date(item.opprettet).toLocaleDateString("nb-NO", { year: 'numeric', month: 'short', day: 'numeric' }) }}
      </template>

    </v-data-table>
  </v-container>
</template>

<script>
import JishoDataService from "../services/JishoDataService";

export default {
  name: 'Forslag',
  data () {
    return {
      headers: [
        {
          text: 'Oppslagsord',
          align: 'start',
          value: 'oppslag',
          width: '15%'
        },
        { text: 'Forslag til definisjon', value: 'forslag_definisjon', width: '40%' },
        { text: 'Oversatt av', value: 'brukernavn', width: '10%' },
        { text: 'Stemmer', value: 'stemmer', width: '20%' },
        { text: 'Dato', value: 'opprettet', width: '15%' },
      ],
      forslag: [],
      snackbar: false,
      timeout: 2000,
      snackbarMessage: '',
      snackbarColor: 'success'
    }
  },

  methods: {
    refresh () {
      JishoDataService.getAllForslag()
        .then(result => {
          this.forslag = result.data
        })
    },
    stemForslag (item, type) {
      JishoDataService.stemForslag(item.forslag_id, { type: type })
        .then((response) => {
          console.log(response)
          this.snackbarMessage = response.data
          this.snackbarColor = 'success'
          this.snackbar = true
          this.refresh()
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.snackbarMessage = error.response.data
            this.snackbarColor = 'error'
            this.snackbar = true
          }
        })
    }
  },
  mounted () {
    this.refresh()
  }
}
</script>