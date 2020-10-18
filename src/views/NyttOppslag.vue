<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col
        md=6
        sm=6
      >
        <h1></h1>
        <v-card>
          <v-card-title class="pb-3">
            <span v-if="approveMode">{{ $t("navbar.edit_approve") }}</span>
            <span v-else>{{ $t("navbar.new_word") }}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model="word"
                :label="$t('ord.oppslagsord')"
                :disabled="!$store.getters.isAdmin"
                outlined
              />
              <v-select
                :items="partsOfSpeech"
                v-model="wordClass"
                :label="$t('ord.ordklasse')"
                outlined
              ></v-select>
              <v-text-field
                v-model="parts"
                :label="$t('ord.ledd')"
                outlined
                hint="Bruk * mellom eventuelle ledd. F.eks.: hage*slange"
              />
              <div v-if="conjugations.length > 0 && $store.getters.isAdmin && approveMode">
                <div
                  v-for="(conjugation,i) in conjugations"
                  :key=i
                >
                  <h3>Bøyning {{ i + 1 }}</h3>
                  <div
                    v-for="(value, name) in conjugation"
                    :key=name
                  >
                    <v-text-field
                      v-model="conjugation[name]"
                      :label="name"
                      outlined
                    />
                  </div>
                </div>
                <div class="text-center">
                  <v-icon
                    color="green lighten-1"
                    v-on:click="pushNewConjugation(wordClass)"
                  >mdi-plus-circle </v-icon>
                  <v-icon
                    v-if="conjugations.length > 1"
                    color="red lighten-1"
                    v-on:click="conjugations.pop()"
                  >mdi-minus-circle </v-icon>
                </div>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="!approveMode"
              color="green"
              class="white--text"
              @click="postNewWord"
              :disabled="!valid"
            >
              {{ $t("knapper.foreslå") }}
            </v-btn>
            <v-btn
              v-if="$store.getters.isAdmin && approveMode"
              color="red"
              class="white--text"
              @click="rejectWordSuggestion"
            >
              {{ $t("knapper.avvis") }}
            </v-btn>
            <v-btn
              v-if="$store.getters.isAdmin && approveMode"
              color="primary"
              class="white--text"
              @click="acceptWordSuggestion"
            >
              {{ $t("knapper.godkjenn") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </v-container>

</template>

<script>
import JishoDataService from "../services/JishoDataService";

export default {
  name: "NyttOppslag",
  components: {
  },
  data () {
    return {
      approveMode: false,
      valid: false,
      wordSuggestionID: null,
      word: '',
      wordClass: '',
      parts: '',
      conjugations: [],
      partsOfSpeech: ['adj', 'adv', 'det', 'egennavn', 'forkorting', 'interjeksjon', 'konjunksjon', 'partikkelverb', 'prefiks', 'pron', 'subjunksjon', 'subst', 'symbol', 'uttrykk', 'verb'],
      hasConjugation: ['adj', 'adv', 'det', 'pron', 'subst', 'verb']
    }
  },
  methods: {
    getWordSuggestion (wordID) {
      JishoDataService.getWordSuggestion(wordID)
        .then(response => {
          console.log(response.data)
          const wordData = response.data
          this.word = wordData.oppslag
          this.wordClass = wordData.boy_tabell
          this.parts = wordData.ledd
        })
    },
    postNewWord () {
      JishoDataService.postWordSuggestion({
        word: this.word,
        wordClass: this.wordClass,
        parts: this.parts,
      })
        .then((response) => {
          this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
          setTimeout(() => this.$router.push('/oppslag_forslag'), 2000)
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
          console.log(error)
        })
    },
    acceptWordSuggestion () {
      JishoDataService.acceptWordSuggestion(this.wordSuggestionID, {
        word: this.word,
        wordClass: this.wordClass,
        parts: this.parts,
        conjugations: this.conjugations
      })
        .then((response) => {
          this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
          setTimeout(() => this.$router.push('/oppslag_forslag'), 2000)
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
          console.log(error)
        });
    },
    rejectWordSuggestion () {
      JishoDataService.rejectWordSuggestion(this.wordSuggestionID)
        .then((response) => {
          this.$store.dispatch('show_snackbar', { message: response.data, color: 'success' })
          setTimeout(() => this.$router.push('/oppslag_forslag'), 2000)
        })
        .catch(error => {
          this.$store.dispatch('show_snackbar', { message: error.response.data, color: 'error' })
          console.log(error)
        })
    },
    pushNewConjugation (pos) {
      let common = {
        pos: '',
        paradigme: '',
        boy_skjema: '',
      }
      let conjugation

      if (pos === 'adj') {
        conjugation = {
          ...common, ...{
            m_entall: '',
            f_entall: '',
            n_entall: '',
            bestemt_entall: '',
            flertall: '',
            komparativ: '',
            superlativ: '',
            superlativ_bestemt: '',
          }
        }
      }
      if (pos === 'adv') {
        conjugation = {
          ...common, ...{
            pos: '',
            paradigme: '',
            boy_skjema: '',
            positiv: '',
            komparativ: '',
            superlativ: '',
          }
        }
      }
      if (pos === 'det') {
        conjugation = {
          ...common, ...{
            m_entall: '',
            f_entall: '',
            n_entall: '',
            bestemt_entall: '',
          }
        }
      }
      if (pos === 'pron') {
        conjugation = {
          ...common, ...{
            subjektsform: '',
            objektsform: '',
          }
        }
      }
      if (pos === 'subst') {
        conjugation = {
          ...common, ...{
            ubestemt_entall: '',
            bestemt_entall: '',
            ubestemt_flertall: '',
            bestemt_flertall: '',
          }
        }
      }
      if (pos === 'verb') {
        conjugation = {
          ...common, ...{
            infinitiv: '',
            presens: '',
            preteritum: '',
            presens_perfektum: '',
            imperativ: '',
            perf_part_mf: '',
            perf_part_n: '',
            perf_part_bestemt: '',
            perf_part_flertall: '',
            presens_partisipp: '',
          }
        }
      }
      this.conjugations.push(conjugation)
    }
  },
  watch: {
    wordClass: function (val) {
      this.conjugations = []
      if (this.hasConjugation.includes(val)) {
        this.pushNewConjugation(val)
      }
      if (val != '') {
        this.valid = true
      } else {
        this.valid = false
      }
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.wordSuggestionID = this.$route.params.id
      this.approveMode = true
      this.getWordSuggestion(this.wordSuggestionID)
    } else {
      this.word = this.$route.params.oppslag
    }
  }
}
</script>