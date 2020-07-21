<template>
  <v-container>
    <v-tabs
      fixed-tabs
      v-model="tab"
    >
      <v-tab>
        Anbefalinger

      </v-tab>
      <v-tab>
        Søk etter ord
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-row>
          <v-col align="center">
            <v-card max-width="600px">
              <v-card-title>
                10 ord som trenger oversettelse
              </v-card-title>
              <v-card-text align="left">
                gsagas
              </v-card-text>
            </v-card>

          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>

        <oversikt v-bind:admin-view="true">

        </oversikt>

      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import Oversikt from '../components/Oversikt'

export default {
  data () {
    return {
      tab: null
    }
  },
  components: {
    oversikt: Oversikt
  },
  methods: {

  }
}
</script>