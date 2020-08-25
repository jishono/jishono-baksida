<template>
  <v-container v-if="$store.getters.isAdmin">
    <v-row no-gutters>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="users"
          :header-props="{ sortIcon: null }"
        >
          <template v-slot:[`item.admin`]="{ item }">
            <v-icon v-if="item.admin === 1" color="green" small>
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon v-else color="red" small>
              mdi-close-circle</v-icon>
          </template>
          <template v-slot:[`item.sist_sett`]="{ item }">
            {{ new Date(item.sist_sett).toLocaleDateString("nb-NO", { year: 'numeric', month: 'short', day: 'numeric' }) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>

</template>


<script>
import JishoDataService from '../services/JishoDataService'

export default {
  name: 'users',
  data () {
    return {
      users: [],
      headers: [
        { text: "ID", value: 'user_id', width: '1%', align: "start" },
        { text: "Brukernavn", value: 'brukernavn', width: '10%' },
        { text: "E-post", value: 'epost', width: '10%' },
        { text: "Sist sett", value: 'sist_sett', width: '10%' },
        { text: "Admin", value: 'admin', width: '1%' },
        { text: "Oppdateringer", value: 'opp_periode', width: '1%' },
      ]
    }
  },
  methods: {
    getUserData () {
      JishoDataService.getAllUsers()
        .then((response) => {
          console.log(response.data)
          this.users = response.data
        })
    }
  },
  mounted () {
    this.getUserData()
  }
}


</script>