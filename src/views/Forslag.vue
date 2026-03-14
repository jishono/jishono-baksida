<template>
  <v-container fluid class="pa-2 ma-0">
    <v-dialog
      v-model="kommentar_dialog"
      width="500"
      @click:outside="closeKommentarDialog"
    >
      <oppslag
        v-if="current_lemma_id"
        :lemma_id="current_lemma_id"
        @close="closeKommentarDialog"
        @refresh="refreshCurrentTab"
      ></oppslag>
    </v-dialog>
    <div class="d-flex flex-column flex-sm-row align-center mb-2">
      <v-tabs v-model="tab">
        <v-tab>
          {{ $t('forslag.alle') }}
        </v-tab>
        <v-tab>
          {{ $t('forslag.mine') }}
        </v-tab>
        <v-tab @click="getAiForslag"> AI </v-tab>
      </v-tabs>
      <div
        v-if="tab !== 2"
        class="d-flex align-center mt-3 mt-sm-0 ml-sm-auto flex-shrink-0"
      >
        <v-chip
          class="mx-1"
          size="small"
          color="primary"
          :variant="!filtrer_har_kommentarer ? 'outlined' : 'flat'"
          @click="filtrer_har_kommentarer = !filtrer_har_kommentarer"
        >
          <v-icon size="small" v-if="filtrer_har_kommentarer" start
            >mdi-checkbox-marked-circle</v-icon
          >
          <v-icon size="small" v-else start
            >mdi-checkbox-blank-circle-outline</v-icon
          >
          {{ $t('forslag.har_kommentarer') }}
        </v-chip>
        <v-chip
          class="mx-1"
          size="small"
          color="primary"
          :variant="!filtrer_uleste ? 'outlined' : 'flat'"
          @click="filtrer_uleste = filtrer_uleste ? false : true"
        >
          <v-icon size="small" v-if="filtrer_uleste" start
            >mdi-checkbox-marked-circle</v-icon
          >
          <v-icon size="small" v-else start
            >mdi-checkbox-blank-circle-outline</v-icon
          >
          {{ $t('forslag.uleste_kommentarer') }}
        </v-chip>
        <v-chip
          class="mx-1"
          size="small"
          color="primary"
          :variant="!filtrer_ikke_stemt ? 'outlined' : 'flat'"
          @click="filtrer_ikke_stemt = filtrer_ikke_stemt ? false : true"
        >
          <v-icon size="small" v-if="filtrer_ikke_stemt" start
            >mdi-checkbox-marked-circle</v-icon
          >
          <v-icon size="small" v-else start
            >mdi-checkbox-blank-circle-outline</v-icon
          >
          {{ $t('forslag.ikke_stemt') }}
        </v-chip>
      </div>
    </div>

    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Søk"
    ></v-text-field>

    <!-- Desktop: table -->
    <v-data-table
      v-if="$vuetify.display.width >= 720"
      :headers="currentHeaders"
      :items="filtrerteForslag"
      v-model:page="page"
      :items-per-page="20"
      :sort-by="[{ key: 'siste_opprettet', order: 'desc' }]"
      hover
      @click:row="(e, { item }) => openKommentarDialog(item)"
      class="elevation-1"
    >
      <template v-slot:[`item.lemma_id`]="{ item }">
        <div style="width: 60px" class="d-flex align-center">
          <span>{{ item.lemma_id }}</span>
          <router-link
            v-if="$store.getters.isAdmin"
            :to="{ path: 'endre/' + item.lemma_id }"
            @click.stop
            class="ml-1"
            style="text-decoration: none; line-height: 1"
          >
            <v-icon size="14" color="grey" class="wrench-icon"
              >mdi-wrench</v-icon
            >
          </router-link>
        </div>
      </template>
      <template v-slot:[`item.oppslag`]="{ item }">
        {{ item.oppslag }}
      </template>
      <template v-slot:[`item.boy_tabell`]="{ item }">
        {{ ordklasseNavn(item.boy_tabell) }}
      </template>
      <template v-slot:[`item.definisjoner_og_forslag`]="{ item }">
        <div
          v-for="(d, i) in item.definisjoner"
          :key="'def-' + i"
          class="text-green-darken-2 py-1 d-flex align-center"
        >
          <span
            ><span class="text-caption font-weight-bold mr-1">{{ i + 1 }}.</span
            >{{ d.definisjon || d }}</span
          >
          <v-tooltip
            v-if="d.source === 'AI'"
            :text="$t('forslag.kilde_ai')"
            location="top"
          >
            <template v-slot:activator="{ props: sourceProps }">
              <v-icon
                v-bind="sourceProps"
                size="16"
                class="ml-4 source-icon"
                color="blue"
                >mdi-robot-outline</v-icon
              >
            </template>
          </v-tooltip>
          <v-tooltip
            v-else-if="d.source === 'WIKI'"
            :text="$t('forslag.kilde_wiki')"
            location="top"
          >
            <template v-slot:activator="{ props: sourceProps }">
              <v-icon
                v-bind="sourceProps"
                size="16"
                class="ml-4 source-icon"
                color="black"
                >mdi-wikipedia</v-icon
              >
            </template>
          </v-tooltip>
        </div>
        <div
          v-for="(f, j) in item.forslag"
          :key="f.forslag_id"
          class="text-error py-1 d-flex align-center"
        >
          <span class="text-caption font-weight-bold mr-1"
            >{{ f.prioritet }}.</span
          >
          <v-icon
            v-if="f.replaces_def_id"
            size="14"
            class="mr-1 flex-shrink-0"
            color="error"
            >mdi-swap-horizontal</v-icon
          >
          <span v-html="addFurigana(f.forslag_definisjon)"></span>
          <span
            class="text-caption text-medium-emphasis ml-1"
            v-if="f.endret == true"
            >({{ $t('veggen.endret') }})</span
          >
        </div>
      </template>
      <template v-slot:[`item.kommentarer`]="{ item }">
        <v-chip
          variant="flat"
          size="default"
          :color="item.usett > 0 ? 'red' : 'orange'"
          class="px-2 kommentar-chip"
          @click.stop="openKommentarDialog(item)"
        >
          <span class="mr-1">{{ item.antall_kommentarer }}</span>
          <v-icon size="small">mdi-comment-text</v-icon>
        </v-chip>
      </template>
    </v-data-table>

    <!-- Mobile: cards -->
    <v-data-iterator
      v-else
      :items="filtrerteForslag"
      v-model:page="page"
      :items-per-page="20"
      :sort-by="[{ key: 'siste_opprettet', order: 'desc' }]"
    >
      <template v-slot:default="{ items }">
        <v-card
          v-for="{ raw: item } in items"
          :key="item.lemma_id"
          class="mb-2"
          hover
          @click="openKommentarDialog(item)"
        >
          <v-card-item>
            <template v-slot:prepend>
              <div class="d-flex align-center mr-2">
                <span class="text-caption text-medium-emphasis">{{
                  item.lemma_id
                }}</span>
                <router-link
                  v-if="$store.getters.isAdmin"
                  :to="{ path: 'endre/' + item.lemma_id }"
                  @click.stop
                  class="ml-1"
                  style="text-decoration: none; line-height: 1"
                >
                  <v-icon size="14" color="grey" class="wrench-icon"
                    >mdi-wrench</v-icon
                  >
                </router-link>
              </div>
            </template>
            <v-card-title class="pa-0 text-body-1 font-weight-bold">{{
              item.oppslag
            }}</v-card-title>
            <v-card-subtitle class="pa-0">{{
              ordklasseNavn(item.boy_tabell)
            }}</v-card-subtitle>
            <template v-slot:append>
              <v-chip
                variant="flat"
                size="default"
                :color="item.usett > 0 ? 'red' : 'orange'"
                class="px-2 kommentar-chip"
                @click.stop="openKommentarDialog(item)"
              >
                <span class="mr-1">{{ item.antall_kommentarer }}</span>
                <v-icon size="small">mdi-comment-text</v-icon>
              </v-chip>
            </template>
          </v-card-item>
          <v-card-text class="pt-1 pb-2">
            <div
              v-for="(d, i) in item.definisjoner"
              :key="'def-' + i"
              class="text-green-darken-2 py-1 d-flex align-center"
            >
              <span>
                <span class="text-caption font-weight-bold mr-1"
                  >{{ i + 1 }}.</span
                >{{ d.definisjon || d }}
              </span>
              <v-tooltip
                v-if="d.source === 'AI'"
                :text="$t('forslag.kilde_ai')"
                location="top"
              >
                <template v-slot:activator="{ props: sourceProps }">
                  <v-icon
                    v-bind="sourceProps"
                    size="16"
                    class="ml-2 source-icon"
                    color="blue"
                    >mdi-robot-outline</v-icon
                  >
                </template>
              </v-tooltip>
              <v-tooltip
                v-else-if="d.source === 'WIKI'"
                :text="$t('forslag.kilde_wiki')"
                location="top"
              >
                <template v-slot:activator="{ props: sourceProps }">
                  <v-icon
                    v-bind="sourceProps"
                    size="16"
                    class="ml-2 source-icon"
                    color="black"
                    >mdi-wikipedia</v-icon
                  >
                </template>
              </v-tooltip>
            </div>
            <div
              v-for="(f, j) in item.forslag"
              :key="f.forslag_id"
              class="text-error py-1 d-flex align-center"
            >
              <span class="text-caption font-weight-bold mr-1"
                >{{ f.prioritet }}.</span
              >
              <v-icon
                v-if="f.replaces_def_id"
                size="14"
                class="mr-1 flex-shrink-0"
                color="error"
                >mdi-swap-horizontal</v-icon
              >
              <span v-html="addFurigana(f.forslag_definisjon)"></span>
              <span
                class="text-caption text-medium-emphasis ml-1"
                v-if="f.endret == true"
                >({{ $t('veggen.endret') }})</span
              >
            </div>
          </v-card-text>
        </v-card>
      </template>

      <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-2">
          <v-btn
            icon
            size="small"
            variant="text"
            :disabled="page <= 1"
            @click="prevPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span class="text-body-2 mx-3">{{ page }} / {{ pageCount }}</span>
          <v-btn
            icon
            size="small"
            variant="text"
            :disabled="page >= pageCount"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue';

import helpers from '../mixins/helpers';
import JishoDataService from '../services/JishoDataService';
import Oppslag from './Oppslag.vue';

export default defineComponent({
  name: 'Forslag',
  mixins: [helpers],

  data() {
    return {
      tab: 0,
      page: 1,
      kommentar_dialog: false,
      current_lemma_id: null,
      forslag: [],
      search: '',
      filtrer_uleste: false,
      filtrer_ikke_stemt: false,
      filtrer_har_kommentarer: false,
      alle_headers: [
        {
          title: this.$t('ord.lemma_id'),
          align: 'start',
          key: 'lemma_id',
          width: '1%',
        },
        { title: this.$t('ord.oppslagsord'), key: 'oppslag', width: '1%' },
        { title: this.$t('ord.ordklasse'), key: 'boy_tabell', width: '1%' },
        {
          title: this.$t('forslag.forslag_definisjon'),
          key: 'definisjoner_og_forslag',
          sortable: false,
          width: '70%',
        },
        { title: '', key: 'kommentarer', sortable: false, width: '1%' },
      ],
      mine_headers: [
        {
          title: this.$t('ord.lemma_id'),
          align: 'start',
          key: 'lemma_id',
          width: '1%',
        },
        { title: this.$t('ord.oppslagsord'), key: 'oppslag', width: '1%' },
        { title: this.$t('ord.ordklasse'), key: 'boy_tabell', width: '1%' },
        {
          title: this.$t('forslag.forslag_definisjon'),
          key: 'definisjoner_og_forslag',
          sortable: false,
          width: '70%',
        },
        { title: '', key: 'kommentarer', sortable: false, width: '1%' },
      ],
      ai_headers: [
        {
          title: this.$t('ord.lemma_id'),
          align: 'start',
          key: 'lemma_id',
          width: '1%',
        },
        { title: this.$t('ord.oppslagsord'), key: 'oppslag', width: '1%' },
        { title: this.$t('ord.ordklasse'), key: 'boy_tabell', width: '1%' },
        {
          title: this.$t('forslag.forslag_definisjon'),
          key: 'definisjoner_og_forslag',
          sortable: false,
          width: '70%',
        },
        { title: '', key: 'kommentarer', sortable: false, width: '1%' },
      ],
    };
  },

  components: {
    Oppslag,
  },

  watch: {
    tab: function (tabValue) {
      if (tabValue === 0 || tabValue === 1) {
        this.refresh();
      } else if (tabValue === 2) {
        this.getAiForslag();
      }
    },
  },

  computed: {
    filtrerteForslag() {
      const searchLower = this.search.toLowerCase().trim();

      if (this.tab === 2) {
        return this.forslag.filter(lemma =>
          searchLower ? lemma.oppslag.toLowerCase().includes(searchLower) : true
        );
      }

      const user_id = this.$store.getters.user_id;

      return this.forslag
        .map(lemma => {
          let fs = lemma.forslag ?? [];
          if (this.tab === 1) {
            fs = fs.filter(f => f.user_id == user_id);
          }
          if (this.filtrer_uleste) {
            fs = fs.filter(f => f.sett == 0);
          }
          if (this.filtrer_ikke_stemt) {
            fs = fs.filter(f => f.minstemme == null && f.user_id != user_id);
          }
          if (searchLower) {
            const matchesOppslag = lemma.oppslag
              .toLowerCase()
              .includes(searchLower);
            if (!matchesOppslag) {
              fs = fs.filter(f =>
                f.forslag_definisjon.toLowerCase().includes(searchLower)
              );
            }
          }
          const siste_opprettet = fs.reduce(
            (max, f) => (f.opprettet > max ? f.opprettet : max),
            ''
          );
          return { ...lemma, forslag: fs, siste_opprettet };
        })
        .filter(lemma => lemma.forslag?.length > 0)
        .filter(
          lemma => !this.filtrer_har_kommentarer || lemma.antall_kommentarer > 0
        );
    },

    currentHeaders() {
      if (this.tab === 0) {
        return this.alle_headers;
      } else if (this.tab === 2) {
        return this.ai_headers;
      } else {
        return this.mine_headers;
      }
    },
  },

  methods: {
    refresh() {
      JishoDataService.getAllForslag(0)
        .then(result => {
          this.forslag = result.data;
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', {
            message: error.response.data,
            color: 'error',
          });
          console.log(error);
        });
    },
    openKommentarDialog(lemma) {
      this.current_lemma_id = lemma.lemma_id;
      this.$nextTick(() => {
        this.kommentar_dialog = true;
      });
    },
    closeKommentarDialog() {
      this.kommentar_dialog = false;
      this.current_lemma_id = null;
      this.refreshCurrentTab();
    },
    refreshCurrentTab() {
      if (this.tab === 2) {
        this.getAiForslag();
      } else {
        this.refresh();
      }
    },
    getAiForslag() {
      JishoDataService.getAiForslag()
        .then(result => {
          this.forslag = result.data;
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', {
            message: error.response.data,
            color: 'error',
          });
          console.log(error);
        });
    },
  },

  mounted() {
    this.refresh();
  },
});
</script>

<style scoped>
.wrench-icon:hover {
  color: rgb(var(--v-theme-primary)) !important;
  transform: scale(1.3);
  transition:
    color 0.15s,
    transform 0.15s;
}

.kommentar-chip {
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}
.kommentar-chip:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}
.source-icon {
  flex-shrink: 0;
}

.kommentar-chip :deep(.v-chip__content),
.kommentar-chip :deep(.v-icon) {
  color: white !important;
}
</style>
