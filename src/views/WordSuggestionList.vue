<template>
  <v-container>
    <v-row no-gutters>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="suggestions"
          :header-props="{ sortIcon: null }"
          :sort-by="[{key: 'opprettet', order: 'desc'}]"
          @click:row="handleRowClick"
        >
          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              size="small"
              :color="statusColors[item.status].color"
              text-color="white"
            >
              {{ $t(statusColors[item.status].text) }}
            </v-chip>
          </template>
          <template v-slot:[`item.opprettet`]="{ item }">
            {{ new Date(item.opprettet).toLocaleDateString("nb-NO", { year: 'numeric', month: 'short', day: 'numeric' }) }}
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
  name: 'word-suggestion-list',

  data () {
    return {
      suggestions: [],
      headers: [
        { title: this.$t('forslag.id'), key: 'oppslag_forslag_id', width: '2%' },
        { title: this.$t('ord.oppslagsord'), key: 'oppslag', width: '10%' },
        { title: this.$t('ord.ordklasse'), key: 'boy_tabell', width: '10%' },
        { title: this.$t('ord.ledd'), key: 'ledd', width: '10%' },
        { title: this.$t('forslag.bruker'), key: 'brukernavn', width: '10%' },
        { title: this.$t('forslag.status'), key: 'status', width: '10%' },
        { title: this.$t('forslag.dato'), key: 'opprettet', width: '10%' },
      ],
      statusColors: [
        {
          text: 'forslag.forslag',
          color: 'orange'
        },
        {
          text: 'forslag.godkjent_admin',
          color: 'green'
        },
        {
          text: 'forslag.avvist_admin',
          color: 'red-lighten-1'
        }
      ],
    }
  },

  methods: {
    getWordSuggestionsData () {
      JishoDataService.getAllWordSuggestions()
        .then((response) => {
          this.suggestions = response.data
        })
    },
    handleRowClick(item) {
        if (this.$store.getters.isAdmin && item.status === 0) {
            this.$router.push('/nytt_oppslag/id/' + item.oppslag_forslag_id)
        }
    }
  },

  mounted () {
    this.getWordSuggestionsData()
  },
});
</script>