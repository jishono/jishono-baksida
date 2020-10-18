<template>
  <v-container>
    <v-row no-gutters>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="suggestions"
          :header-props="{ sortIcon: null }"
          sort-by="opprettet"
          :sort-desc="true"
          @click:row="handleRowClick"
        >
          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              small
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
import JishoDataService from '../services/JishoDataService'

export default {
  name: 'word-suggestion-list',
  data () {
    return {
      suggestions: [],
      headers: [
        { text: this.$t('forslag.id'), value: 'oppslag_forslag_id', width: '2%' },
        { text: this.$t('ord.oppslagsord'), value: 'oppslag', width: '10%' },
        { text: this.$t('ord.ordklasse'), value: 'boy_tabell', width: '10%' },
        { text: this.$t('ord.ledd'), value: 'ledd', width: '10%' },
        { text: this.$t('forslag.bruker'), value: 'brukernavn', width: '10%' },
        { text: this.$t('forslag.status'), value: 'status', width: '10%' },
        { text: this.$t('forslag.dato'), value: 'opprettet', width: '10%' },
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
          color: 'red lighten-1'
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
  }
}


</script>