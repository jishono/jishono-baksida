<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-row no-gutters>
      <v-col
        align="center"
        cols=12
        class="pa-0"
      >

        <v-tabs
          centered
          v-model="tab"
          class="mb-2"
        >
          <v-tab>
            Anbefalinger

          </v-tab>
          <v-tab>
            Søk
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>

            <v-card max-width="600px">
              <v-card-title>
                10 ord som trenger oversettelse
                <v-spacer></v-spacer>
                <v-btn
                  small
                  color="primary"
                  @click="getAnbefalinger"
                >
                  Generer nye
                </v-btn>
              </v-card-title>
              <v-card-text align="left">
                <v-simple-table
                  fixed-header
                  dense
                >
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Oppslag</th>
                        <th class="text-left">Ordklasse</th>
                        <th class="text-left">Oversett</th>
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

          </v-tab-item>
          <v-tab-item>
            <v-container
              fluid
              class="pa-0"
            >
              <v-row
                align="center"
                justify="center"
                no-gutters
              >
                <v-col
                  sm=8
                  cols=12
                >
                  <Sok v-bind:admin-view="true">
                  </Sok>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import Sok from '../components/Sok'
import JishoDataService from '../services/JishoDataService'

export default {
  data () {
    return {
      tab: null,
      anbefalinger: []
    }
  },
  components: {
    Sok
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
