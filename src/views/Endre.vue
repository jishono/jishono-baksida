<template>
  <v-container v-if="this.currentOppslag && $store.getters.isAdmin">
    <v-row>
      <v-col align="center">
        <boyningstabell
          v-if="$store.getters.boy_ok.includes(currentOppslag.boy_tabell)"
          v-bind:lemma_id="currentOppslag.lemma_id"
          v-model:boyningsDialog="boyningsDialog"
          @outside_click="boyningsDialog = false"
        />
        <v-btn
          color="primary"
          :href="
            'https://ordbok.uib.no/perl/ordbok.cgi?OPP=' +
            currentOppslag.oppslag +
            '&bokmaal=+'
          "
          target="_blank"
          variant="outlined"
          class="mx-1"
        >
          <v-icon start>mdi-open-in-new</v-icon>
          BMO
        </v-btn>
        <v-btn
          color="primary"
          :href="'https://naob.no/s%C3%B8k/' + currentOppslag.oppslag"
          target="_blank"
          variant="outlined"
          class="mx-1"
        >
          <v-icon start>mdi-open-in-new</v-icon>
          NAOB
        </v-btn>
        <v-btn
          v-if="$store.getters.boy_ok.includes(currentOppslag.boy_tabell)"
          color="primary"
          @click="boyningsDialog = true"
          class="mx-1"
        >
          {{ $t('knapper.vis_boyning') }}
        </v-btn>
        <v-btn
          color="primary"
          :to="'/oppslag/' + currentOppslag.lemma_id"
          class="mx-1"
        >
          Nytt forslag
        </v-btn>
        <v-btn
          v-if="!currentOppslag.definisjon || currentOppslag.definisjon.length === 0"
          color="primary"
          variant="outlined"
          class="mx-1"
          @click="requestTranslation"
        >
          Ønsk ❤️
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" sm="6">
        <h2>Oppslag</h2>
        <v-card>
          <v-card-text>
            <v-form ref="form">
              <v-row no-gutters>
                <v-col cols="8" md="9" xl="10">
                  <v-text-field
                    v-model="currentOppslag.lemma_id"
                    :label="$t('ord.lemma_id')"
                    variant="outlined"
                    disabled
                  />
                </v-col>
                <v-col>
                  <v-checkbox
                    v-model="currentOppslag.is_hidden"
                    class="ml-4 mt-3"
                    label="Skjult"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-text-field
                v-model="currentOppslag.oppslag"
                :label="$t('ord.oppslagsord')"
                variant="outlined"
                disabled
              />
              <v-text-field
                :model-value="ordklasseNavn(currentOppslag.boy_tabell)"
                :label="$t('ord.ordklasse')"
                variant="outlined"
                disabled
              />
              <v-text-field
                v-model="currentOppslag.ledd"
                :label="$t('ord.ledd')"
                variant="outlined"
              />
              <div
                v-for="(ut, index_ut) in currentOppslag.uttale"
                v-bind:key="ut.index_ut"
              >
                <v-text-field v-model="ut.transkripsjon" variant="outlined">
                  <template v-slot:label>
                    {{ $t('ord.uttale') }} {{ index_ut + 1 }}
                  </template>
                  <template v-slot:append>
                    <div
                      v-if="
                        index_ut == currentOppslag.uttale.length - 1 &&
                        $store.getters.isAdmin
                      "
                    >
                      <v-icon color="green-lighten-1" v-on:click="addUttale"
                        >mdi-plus-circle
                      </v-icon>
                      <v-icon color="red-lighten-1" v-on:click="removeUttale"
                        >mdi-minus-circle
                      </v-icon>
                    </div>
                  </template>
                </v-text-field>
              </div>
            </v-form>
            <div class="mt-6 d-flex justify-end">
              <v-btn
                color="primary"
                @click="updateOppslag"
                :disabled="!oppslagChanged"
              >
                <v-icon start>mdi-check</v-icon>
                {{ $t('knapper.oppdater') }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <v-divider class="my-4" />

        <h2 class="mb-3">Definisjoner</h2>
        <v-card>
          <v-card-text>
            <div
              v-for="def in sortedDefinisjoner"
              v-bind:key="def.def_id"
              class="definisjon-rad d-flex align-center mb-2 py-2 px-3"
            >
              <span
                class="text-medium-emphasis font-weight-bold mr-3"
                style="font-size: 1.1rem; min-width: 1.5rem"
                >{{ def.prioritet }}.</span
              >
              <span class="flex-grow-1" style="font-size: 1.05rem">{{
                def.definisjon
              }}</span>
              <div
                class="d-flex align-center flex-shrink-0 ml-2"
                style="gap: 4px"
              >
                <v-tooltip :text="$t('knapper.endre')" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="plain"
                      density="compact"
                      color="orange-darken-1"
                      class="pa-0"
                      style="min-width: 0"
                      @click="openEditDef(def)"
                    >
                      <v-icon size="20">mdi-pencil-outline</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip :text="$t('knapper.slett')" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="plain"
                      density="compact"
                      color="red"
                      class="pa-0"
                      style="min-width: 0"
                      @click="openDeleteDef(def)"
                    >
                      <v-icon size="20">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </div>
            <div class="mt-6 d-flex justify-space-between">
              <v-btn
                color="primary"
                variant="outlined"
                @click="openReorderDialog"
              >
                <v-icon start>mdi-sort</v-icon>
                Rekkefølge
              </v-btn>
              <v-btn
                color="primary"
                variant="outlined"
                @click="addDefDialog = true"
              >
                <v-icon start>mdi-plus</v-icon>
                Definisjon
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="6" sm="6" cols="12">
        <h2>{{ $t('kommentar.kommentarer') }}</h2>
        <OppslagComments :lemmaId="currentOppslag.lemma_id" />
      </v-col>
    </v-row>

    <!-- Edit definisjon modal -->
    <v-dialog v-model="editDefDialog" max-width="500">
      <v-card>
        <v-card-title>{{ $t('knapper.endre') }} definisjon</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editDefText"
            counter
            maxlength="100"
            variant="outlined"
            autofocus
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red" variant="plain" @click="editDefDialog = false">
            {{ $t('knapper.avbryt') }}
          </v-btn>
          <v-btn color="green" variant="flat" @click="confirmEditDef">
            {{ $t('knapper.godkjenn') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete definisjon confirmation modal -->
    <v-dialog v-model="deleteDefDialog" max-width="400">
      <v-card>
        <v-card-title>Slett definisjon</v-card-title>
        <v-card-text v-if="deletingDef">
          Er du sikker på at du vil slette denne definisjonen?
          <div
            class="mt-3 pa-3"
            style="
              border-left: 3px solid #ef5350;
              border-radius: 4px;
              background: rgba(239, 83, 80, 0.06);
            "
          >
            {{ deletingDef.definisjon }}
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" variant="plain" @click="deleteDefDialog = false">
            {{ $t('knapper.avbryt') }}
          </v-btn>
          <v-btn color="red" variant="flat" @click="confirmDeleteDef">
            {{ $t('knapper.slett') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add definisjon modal -->
    <v-dialog v-model="addDefDialog" max-width="500">
      <v-card>
        <v-card-title>Legg til definisjon</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newDefText"
            counter
            maxlength="100"
            variant="outlined"
            autofocus
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red" variant="plain" @click="addDefDialog = false">
            {{ $t('knapper.avbryt') }}
          </v-btn>
          <v-btn color="green" variant="flat" @click="confirmAddDef">
            Opprett
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reorder definisjoner modal -->
    <v-dialog v-model="reorderDialog" max-width="500">
      <v-card>
        <v-card-title>Rekkefølge</v-card-title>
        <v-card-text>
          <div
            v-for="(def, index) in reorderList"
            :key="def.def_id"
            class="reorder-item d-flex align-center mb-2 pa-3 rounded"
            draggable="true"
            @dragstart="onDragStart(index)"
            @dragover.prevent="onDragOver(index)"
            @dragend="onDragEnd"
            :class="{ 'reorder-dragging': dragIndex === index }"
          >
            <v-icon class="mr-3 text-medium-emphasis" style="cursor: grab"
              >mdi-drag</v-icon
            >
            <span class="text-medium-emphasis font-weight-bold mr-3"
              >{{ index + 1 }}.</span
            >
            <span class="flex-grow-1">{{ def.definisjon }}</span>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red" variant="plain" @click="reorderDialog = false">
            {{ $t('knapper.avbryt') }}
          </v-btn>
          <v-btn color="green" variant="flat" @click="confirmReorder">
            {{ $t('knapper.oppdater') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue';

import Boyningstabell from '../components/Boyningstabell.vue';
import OppslagComments from '../components/OppslagComments.vue';
import helpers from '../mixins/helpers';
import JishoDataService from '../services/JishoDataService';

export default defineComponent({
  name: 'Endre',

  mixins: [helpers],

  components: {
    Boyningstabell,
    OppslagComments,
  },

  data() {
    return {
      currentOppslag: null,
      originalOppslag: null,
      boyningsDialog: false,
      editDefDialog: false,
      editingDef: null,
      editDefText: '',
      deleteDefDialog: false,
      deletingDef: null,
      addDefDialog: false,
      newDefText: '',
      reorderDialog: false,
      reorderList: [],
      dragIndex: null,
      dragOverIndex: null,
    };
  },

  computed: {
    oppslagChanged() {
      if (!this.currentOppslag || !this.originalOppslag) return false;
      return (
        this.currentOppslag.is_hidden !== this.originalOppslag.is_hidden ||
        this.currentOppslag.ledd !== this.originalOppslag.ledd ||
        JSON.stringify(this.currentOppslag.uttale) !==
          JSON.stringify(this.originalOppslag.uttale)
      );
    },
    sortedDefinisjoner() {
      if (!this.currentOppslag?.definisjon) return [];
      return [...this.currentOppslag.definisjon].sort(
        (a, b) => a.prioritet - b.prioritet
      );
    },
  },

  methods: {
    refreshOppslag() {
      JishoDataService.get(this.$route.params.id)
        .then(response => {
          this.currentOppslag = response.data;
          if (this.currentOppslag.uttale.length == 0) {
            this.addUttale();
          }
          this.originalOppslag = JSON.parse(
            JSON.stringify({
              is_hidden: this.currentOppslag.is_hidden,
              ledd: this.currentOppslag.ledd,
              uttale: this.currentOppslag.uttale,
            })
          );
        })
        .catch(e => {
          console.log(e);
        });
    },

    updateOppslag() {
      JishoDataService.update(this.currentOppslag.lemma_id, {
        lemma_id: this.currentOppslag.lemma_id,
        is_hidden: this.currentOppslag.is_hidden,
        ledd: this.currentOppslag.ledd,
        uttale: this.currentOppslag.uttale,
      })
        .then(response => {
          this.refreshOppslag();
          this.$store.dispatch('show_snackbar', {
            message: response.data,
            color: 'success',
          });
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', {
            message: error.response.data,
            color: 'error',
          });
          console.log(error);
        });
    },

    addUttale() {
      this.currentOppslag.uttale.push({
        uttale_id: null,
        lemma_id: this.currentOppslag.lemma_id,
        transkripsjon: '',
      });
    },

    removeUttale() {
      this.currentOppslag.uttale.pop();
    },

    openEditDef(def) {
      this.editingDef = def;
      this.editDefText = def.definisjon;
      this.editDefDialog = true;
    },

    confirmEditDef() {
      JishoDataService.updateDefinisjon(this.editingDef.def_id, {
        definisjon: this.editDefText,
        prioritet: this.editingDef.prioritet,
      })
        .then(response => {
          this.$store.dispatch('show_snackbar', {
            message: response.data,
            color: 'success',
          });
          this.editDefDialog = false;
          this.refreshOppslag();
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', {
            message: error.response.data,
            color: 'error',
          });
        });
    },

    openDeleteDef(def) {
      this.deletingDef = def;
      this.deleteDefDialog = true;
    },

    confirmDeleteDef() {
      JishoDataService.deleteDefinisjon(this.deletingDef.def_id)
        .then(response => {
          this.$store.dispatch('show_snackbar', {
            message: response.data,
            color: 'success',
          });
          this.deleteDefDialog = false;
          this.refreshOppslag();
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', {
            message: error.response.data,
            color: 'error',
          });
        });
    },

    openReorderDialog() {
      this.reorderList = [...this.sortedDefinisjoner];
      this.reorderDialog = true;
    },

    onDragStart(index) {
      this.dragIndex = index;
    },

    onDragOver(index) {
      if (this.dragIndex === null || this.dragIndex === index) return;
      const item = this.reorderList.splice(this.dragIndex, 1)[0];
      this.reorderList.splice(index, 0, item);
      this.dragIndex = index;
    },

    onDragEnd() {
      this.dragIndex = null;
    },

    confirmReorder() {
      JishoDataService.reorderDefinisjoner({
        def_ids: this.reorderList.map(d => d.def_id),
      })
        .then(response => {
          this.$store.dispatch('show_snackbar', {
            message: response.data,
            color: 'success',
          });
          this.reorderDialog = false;
          this.refreshOppslag();
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', {
            message: error.response.data,
            color: 'error',
          });
        });
    },

    requestTranslation() {
      JishoDataService.requestTranslation({
        request: this.currentOppslag.oppslag,
      })
        .then(response => {
          this.$store.dispatch('show_snackbar', {
            message: response.data,
            color: 'success',
          });
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', {
            message: error.response.data,
            color: 'error',
          });
        });
    },

    confirmAddDef() {
      JishoDataService.addDefinisjon(this.currentOppslag.lemma_id, {
        definisjon: this.newDefText,
        prioritet: (this.currentOppslag.definisjon?.length ?? 0) + 1,
      })
        .then(response => {
          this.$store.dispatch('show_snackbar', {
            message: response.data,
            color: 'success',
          });
          this.newDefText = '';
          this.addDefDialog = false;
          this.refreshOppslag();
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', {
            message: error.response.data,
            color: 'error',
          });
        });
    },
  },

  mounted() {
    this.refreshOppslag();
  },
});
</script>

<style scoped>
.reorder-item {
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #fff;
  cursor: grab;
  user-select: none;
  transition:
    background-color 0.1s,
    opacity 0.1s;
}
.reorder-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.reorder-dragging {
  opacity: 0.5;
  background-color: rgba(21, 101, 192, 0.08) !important;
}
.definisjon-rad {
  border-left: 3px solid #4caf50;
  border-radius: 4px;
  transition: background-color 0.15s;
}
.definisjon-rad:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
