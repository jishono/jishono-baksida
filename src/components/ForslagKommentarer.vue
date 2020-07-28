<template>
  <v-card>
    <v-card-title>Forslag fra {{ forslag.brukernavn }}
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="$emit('close')"
      >
        <v-icon>
          mdi-close
        </v-icon>

      </v-btn>
    </v-card-title>
    <v-card-text>
      {{forslag.oppslag}} ({{forslag.boy_tabell}})
      <p class="text-h5">{{forslag.forslag_definisjon}}</p>
      <span class="text-h6">Kommentarer</span>
      <v-btn
        class="float-right"
        dark
        color="green"
        small
        @click="postKommentar"
      >
        Post kommentar
      </v-btn>
      <v-textarea
        outlined
        label="Ny kommentar"
        v-model="ny_kommentar"
        rows="4"
      ></v-textarea>
      <div v-if="kommentarer">
        <div
          v-for="(kom) in kommentarer"
          v-bind:key="kom.forslag_kommentar_id"
        >
          <v-card class="mb-4">
            <v-card-title
              class="headline grey lighten-3 body-2 pa-0"
              primary-title
            >
              <v-col cols=5>
                <span class="font-weight-black"> {{ kom.brukernavn}} </span>
              </v-col>
              <v-col align="end">
                {{ new Date(kom.opprettet).toLocaleString("da-DK")}}
              </v-col>
            </v-card-title>
            <v-card-text class="pa-3">
              <div class="text--primary">{{ kom.kommentar}}</div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>

    </v-card-actions>
  </v-card>

</template>

<script>
import JishoDataService from "../services/JishoDataService";

export default {
  name: 'forslag-kommentarer',
  data () {
    return {
      ny_kommentar: '',
      kommentarer: []
    }
  },
  props: {
    forslag: Object
  },
  watch: {
    forslag: function () {
      this.hentKommentarer()
    }
  },
  methods: {
    postKommentar () {
      if (this.ny_kommentar !== '') {
        JishoDataService.postForslagKommentar(this.forslag.forslag_id, { ny_kommentar: this.ny_kommentar })
          .then(response => {
            this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
            this.ny_kommentar = ''
            this.hentKommentarer()
          })
          .catch(error => {
            this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
            this.ny_kommentar = ''
            this.hentKommentarer()
          })
      }
    },
    hentKommentarer () {
      JishoDataService.getForslagKommentarer(this.forslag.forslag_id)
        .then(response => {
          this.kommentarer = response.data
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
        })
    }
  },
  mounted () {
    this.hentKommentarer()
  }
}


</script>