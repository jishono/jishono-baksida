<template>
  <div class="container">
    <div class="row">
      <div class="col">
      </div>
      <div class="col-6">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Søk etter ord/oppslag"
            v-model="q"
            @keyup.enter="sokOppslag()"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="sokOppslag()"
            >
              Søk
            </button>
          </div>
        </div>
      </div>
      <div class="col">
      </div>
    </div>
    <div class="row pt-3">
      <div class="col text-right">

        <div class="form group">
          <h4>filter</h4>
          <div class="custom-control custom-checkbox">
            <input
              type="checkbox"
              class="custom-control-input align-self-end"
              value=""
              id="yesdefcheck"
              @click="setmeduten('meddef');sokOppslag();"
            >
            <label
              class="custom-control-label"
              for="yesdefcheck"
            > med definisjoner
            </label>
          </div>
          <div class="custom-control custom-checkbox">
            <input
              type="checkbox"
              class="custom-control-input align-self-end"
              value=""
              id="nodefcheck"
              @click="setmeduten('utendef');sokOppslag();"
            >
            <label
              class="custom-control-label"
              for="nodefcheck"
            > uten definisjoner
            </label>
          </div>
          <div class="custom-control custom-checkbox">
            <input
              type="checkbox"
              class="custom-control-input align-self-end"
              value=""
              id="yesutcheck"
              @click="setmeduten('medut');sokOppslag();"
            >
            <label
              class="custom-control-label"
              for="yesutcheck"
            > med uttale
            </label>
          </div>
          <div class="custom-control custom-checkbox">
            <input
              type="checkbox"
              class="custom-control-input align-self-end"
              value=""
              id="noutcheck"
              @click="setmeduten('utenut');sokOppslag();"
            >
            <label
              class="custom-control-label"
              for="noutcheck"
            > uten uttale
            </label>
          </div>
          <h5 style="margin-top: 1em;">ordklasse</h5>
          <div
            class="custom-control custom-checkbox"
            v-for="(value,ordklasse) in pos"
            :key="ordklasse"
          >
            <input
              type="checkbox"
              class="custom-control-input align-self-end"
              :id="ordklasse"
              v-model="pos[ordklasse]"
              @change="sokOppslag();"
            >
            <label
              class="custom-control-label"
              :for="ordklasse"
            > {{ ordklasse }}
            </label>

          </div>
        </div>
      </div>
      <div
        class="col-6 text-left"
        style="z-index:1;"
      >
        <div v-if="oppslagsliste.length > 0">
          <h4>treff: {{ this.treff}} </h4>
          <ul class="list-group">
            <li
              class="list-group-item"
              :class="{ active: index == currentIndex }"
              v-for="(oppslag, index) in oppslagsliste.slice(0, 1000)"
              :key="index"
              @click="setActiveOppslag(oppslag, index)"
            >
              {{ oppslag.oppslag }}
            </li>
          </ul>
        </div>
      </div>
      <div class="col text-left">
        <div
          class="position-fixed"
          style="z-index:2;"
        >
          <div v-if="currentOppslag">
            <h4>Oppslagsord</h4>
            <div>
              <label><strong>Lemma ID:</strong></label> {{ currentOppslag.lemma_id }}
            </div>
            <div>
              <label><strong>Oppslagsord:</strong></label> {{ currentOppslag.oppslag }}
            </div>
            <div>
              <label><strong>Ledd:</strong></label> {{ currentOppslag.ledd }}
            </div>
            <div>
              <label><strong>Hovedordklasse:</strong></label> {{ currentOppslag.boy_tabell  }}
            </div>
            <div>
              <label><strong>Notis:</strong></label> {{ currentOppslag.notis }}
            </div>
            <div>
              <label><strong>Uttale:</strong></label>
            </div>
            <div
              v-for="(ut) in currentOppslag.uttale"
              v-bind:key="ut.transkripsjon"
            >
              {{ ut.transkripsjon }}
            </div>
            <div>
              <label><strong>Definisjoner:</strong></label>
            </div>
            <div
              v-for="(definisjon) in currentOppslag.definisjon"
              v-bind:key="definisjon.definisjon"
            >
              {{ definisjon.prioritet }})
              {{ definisjon.definisjon }}
            </div>

            <Boyningstabell
              v-if="tabellSynlig"
              v-bind:lemma_id="currentOppslag.lemma_id"
              @close="closeModal"
            />

            <button
              type="button"
              class="btn btn-primary"
              style="margin:5px;margin-top:30px"
              @click="showModal"
            >
              Vis bøyninger
            </button>

            <a
              class="btn btn-warning"
              style="margin:5px;margin-top:30px"
              :href="'/admin/endre/' + currentOppslag.lemma_id"
            >
              Endre
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JishoDataService from "../services/JishoDataService";
import Boyningstabell from '../components/Boyningstabell.vue';
import _ from 'lodash';

export default {
  name: "oversikt",
  components: {
    Boyningstabell,
  },
  data () {
    return {
      oppslagsliste: [],
      currentOppslag: null,
      currentIndex: -1,
      tabellSynlig: false,
      q: "",
      treff: null,
      meduten: {
        meddef: false,
        utendef: false,
        medut: false,
        utenut: false,
      },
      pos: {
        adj: false,
        adv: false,
        det: false,
        forkorting: false,
        interjeksjon: false,
        konjunksjon: false,
        prefiks: false,
        preposisjon: false,
        pron: false,
        subjunksjon: false,
        subst: false,
        symbol: false,
        verb: false,
      }
    };
  },
  watch: {
    q: _.debounce(function() {
      if (this.q != '' && this.q != '%') {
        this.sokOppslag()
      }
    }, 100)
  },
  methods: {

    setActiveOppslag (oppslag, index) {
      if (this.currentIndex == index) {
        this.currentIndex = -1
        this.currentOppslag = null
      } else {
        JishoDataService.get(oppslag.lemma_id)
          .then(response => {
            this.currentOppslag = response.data;
          })
          .catch(e => {
            console.log(e);
          })
        this.currentIndex = index;
      }
    },
    sokOppslag () {
      let string = ""
      Object.keys(this.pos).forEach(ordklasse => {
        string += "&" + ordklasse + "=" + this.pos[ordklasse]
      });

      JishoDataService.findByOppslag(this.q, this.meduten.meddef,
        this.meduten.utendef, this.meduten.medut, this.meduten.utenut,
        string)
        .then(response => {
          this.oppslagsliste = response.data;
          this.currentIndex = -1;
          this.currentOppslag = null;
          this.treff = this.oppslagsliste.length
        })
        .catch(e => {
          console.log(e);
        });
    },
    showModal () {
      this.tabellSynlig = true;
    },
    closeModal () {
      this.tabellSynlig = false;
    },
    setmeddef () {
      this.meddef = this.meddef ? false : true;
    },
    setutendef () {
      this.utendef = this.utendef ? false : true;
    },
    setmedut () {
      this.medut = this.medut ? false : true;
    },
    setutenut () {
      this.utenut = this.utenut ? false : true;
    },
    setmeduten (varname) {
      this.meduten[varname] = this.meduten[varname] ? false : true;
    },
    setpos (pos) {
      this.pos[pos] = this.pos[pos] ? false : true;
    },
  },
  mounted () {

  }
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}

.custom-control.custom-checkbox {
  padding-left: 0;
}

label.custom-control-label {
  position: relative;
  padding-right: 1.5rem;
}

label.custom-control-label::before,
label.custom-control-label::after {
  right: 0;
  left: auto;
}
</style>