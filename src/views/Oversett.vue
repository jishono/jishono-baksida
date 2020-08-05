<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-row
      no-gutters
    >
      <v-col
        cols=12
        class="pa-0"
      >
        <v-card max-width="600px" class="mx-auto">
          <v-card-title>
            {{ $t('oversett.anbefalinger') }}
            <v-spacer></v-spacer>
            <v-btn
              class="hidden-xs-only"
              small
              color="primary"
              @click="getAnbefalinger"
            >
              <v-icon small left>mdi-reload</v-icon>
              {{ $t('oversett.hent_flere') }}
            </v-btn>
            <v-btn
              class="hidden-sm-and-up"
              fab
              x-small
              color="primary"
              @click="getAnbefalinger"
            >
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            {{ $t('oversett.anbefalinger_title') }}
          </v-card-subtitle>
          <v-card-text align="left">
            <v-simple-table
              fixed-header
              dense
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">{{ $t('ord.oppslagsord') }}</th>
                    <th class="text-left">{{ $t('ord.ordklasse') }}</th>
                    <th class="text-left">{{ $t('oversett.oversett') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in anbefalinger"
                    :key="item.lemma_id"
                  >
                    <td>{{ item.oppslag }}</td>
                    <td>{{ item.boy_tabell }}</td>
                    <td>
                      <v-btn
                        icon
                        small
                        color="green lighten-1"
                        :to="'/nytt_forslag/' + item.lemma_id"
                      >
                        <v-icon small>
                          mdi-translate
                        </v-icon>
                      </v-btn>
                      <v-btn
                        v-if="$store.getters.isAdmin"
                        icon
                        small
                        color="red"
                        :to="'/endre/' + item.lemma_id"
                      >
                        <v-icon small>
                          mdi-pencil
                        </v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import JishoDataService from '../services/JishoDataService'

export default {
  data () {
    return {
      tab: null,
      anbefalinger: []
    }
  },
  methods: {
    getAnbefalinger () {
      JishoDataService.getAnbefalinger()
        .then(response => {
          this.anbefalinger = response.data
        })
        .catch(error => {
          console.log(error)
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
        })
    }
  },
  mounted () {
    this.getAnbefalinger()
  }
}
</script>
