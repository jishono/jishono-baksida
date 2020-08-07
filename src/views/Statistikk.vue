<template>
  <v-container v-if="statistikk">
    <v-row
      no-gutters
      justify="center"
    >
      <v-col 
      lg=9
      cols=12>
        <v-card class="ma-2">
          <v-card-title>
            {{ $t('statistikk.diverse') }}
          </v-card-title>
          <v-card-text>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">{{ $t('statistikk.type') }}</th>
                    <th class="text-left">{{ $t('statistikk.antall') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in statistikk.oppslag_info"
                    :key="item.tittel"
                  >
                    <td>{{ $t('statistikk.' + item.tittel) }}</td>
                    <td>{{ item.antall }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
        <v-card class="ma-2">
          <v-card-title> {{ $t('statistikk.siste_30') }}</v-card-title>
          <line-chart
            v-bind:nye_oversettelser="this.statistikk.nye_oversettelser"
            v-bind:nye_forslag="this.statistikk.nye_forslag"
            v-bind:antall_kommentarer="this.statistikk.antall_kommentarer"
          >
          </line-chart>
        </v-card>
      </v-col>
      <v-col
        lg=3
        cols=12
      >
        <v-card class="ma-2">
          <v-card-title>
            {{ $t('statistikk.brukere') }}
          </v-card-title>
          <v-card-text>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">{{ $t('bruker.brukernavn') }}</th>
                    <th class="text-left">{{ $t('statistikk.oversettelser') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in statistikk.brukeroversettelser"
                    :key="item.brukernavn"
                  >
                    <td>{{ item.brukernavn }}</td>
                    <td>{{ item.antall_oversettelser }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      justify="center"
    >
      <v-col>

      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import JishoDataService from '../services/JishoDataService'
import LineChart from '../components/LineChart'

export default {
  name: 'statistikk',
  data () {
    return {
      statistikk: null,
    }
  },
  components: {
    LineChart
  },
  methods: {

  },
  mounted () {
    JishoDataService.getStatistikk()
      .then(response => {
        this.statistikk = response.data
      })
      .catch(error => {
        console.log(error)
      })
  }
}

</script>