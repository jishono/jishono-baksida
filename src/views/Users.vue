<template>
  <v-container v-if="$store.getters.isAdmin">
    <v-row no-gutters>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="users"
          :header-props="{ sortIcon: null }"
          :sort-by="[{key: 'sist_sett', order: 'desc'}]"
        >
          <template v-slot:[`item.admin`]="{ item }">
            <v-icon
              v-if="item.admin === 1"
              color="green"
              size="small"
            >
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon
              v-else
              color="red"
              size="small"
            >
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
import { defineComponent } from 'vue';

import JishoDataService from '../services/JishoDataService'

export default defineComponent({
  name: 'users',

  data () {
    return {
      users: [],
      headers: [
        { title: "ID", key: 'user_id', width: '1%', align: "start" },
        { title: "Brukernavn", key: 'brukernavn', width: '10%' },
        { title: "E-post", key: 'epost', width: '10%' },
        { title: "Sist sett", key: 'sist_sett', width: '10%' },
        { title: "Admin", key: 'admin', width: '1%' },
        { title: "Oppdateringer", key: 'opp_periode', width: '1%' },
      ]
    }
  },

  methods: {
    getUserData () {
      JishoDataService.getAllUsers()
        .then((response) => {
          this.users = response.data
        })
    }
  },

  mounted () {
    this.getUserData()
  },
});
</script>