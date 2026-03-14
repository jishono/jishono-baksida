<template>
  <div>
    <v-textarea
      variant="outlined"
      :label="$t('kommentar.ny_kommentar')"
      v-model="ny_kommentar"
      rows="4"
    ></v-textarea>
    <div class="d-flex justify-end">
      <v-btn color="green" size="small" @click="postKommentar">
        {{ $t('kommentar.post_kommentar') }}
      </v-btn>
    </div>
    <div v-if="kommentarer.length" class="mt-8">
      <div v-for="kom in kommentarer" :key="kom.lemma_kommentar_id">
        <v-card class="mb-4">
          <v-card-title
            class="headline bg-orange-lighten-3 text-body-2 pa-3 d-flex align-center"
          >
            <v-avatar :color="randomFarge(kom.brukernavn)" size="32">
              <span class="text-white">{{
                initialer(kom.brukernavn)
              }}</span>
            </v-avatar>
            <span class="font-weight-black ml-2">{{ kom.brukernavn }}</span>
            <v-spacer></v-spacer>
            <span class="text-medium-emphasis">{{
              new Date(kom.opprettet).toLocaleString('da-DK')
            }}</span>
          </v-card-title>
          <v-card-text class="pa-3">
            <vue-markdown
              class="linjeskift"
              :source="kom.kommentar"
              :plugins="[markdownItEmoji]"
            ></vue-markdown>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import { full as markdownItEmoji } from 'markdown-it-emoji';
import VueMarkdown from 'vue-markdown-render';
import helpers from '../mixins/helpers';
import JishoDataService from '../services/JishoDataService';

export default defineComponent({
  name: 'OppslagComments',
  mixins: [helpers],

  components: {
    VueMarkdown,
  },

  props: {
    lemmaId: { type: Number, required: true },
  },

  emits: ['posted'],

  data() {
    return {
      ny_kommentar: '',
      kommentarer: [],
      markdownItEmoji,
    };
  },

  watch: {
    lemmaId: {
      immediate: true,
      handler(id) {
        if (id) this.hentKommentarer();
      },
    },
  },

  methods: {
    hentKommentarer() {
      JishoDataService.getForslagKommentarer(this.lemmaId)
        .then(response => {
          this.kommentarer = response.data;
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', {
            message: error.response.data,
            color: 'error',
          });
        });
    },
    postKommentar() {
      if (this.ny_kommentar !== '') {
        JishoDataService.postForslagKommentar(this.lemmaId, {
          ny_kommentar: this.ny_kommentar,
        })
          .then(response => {
            this.$store.dispatch('show_snackbar', {
              message: response.data,
              color: 'success',
            });
            this.ny_kommentar = '';
            this.hentKommentarer();
            this.$emit('posted');
          })
          .catch(error => {
            this.$store.dispatch('show_snackbar', {
              message: error.response.data,
              color: 'error',
            });
          });
      }
    },
  },
});
</script>
