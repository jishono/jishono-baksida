<template>
  <div
    class="container"
    v-if="this.currentOppslag"
  >
    <div class="row">
      <div
        class="col"
        style="text-align: center"
      >
        <Boyningstabell
          v-if="tabellSynlig"
          v-bind:lemma_id="currentOppslag.lemma_id"
          @close="closeModal"
        />

        <button
          type="button"
          class="btn btn-primary"
          style="margin:5px;"
          @click="showModal"
        >
          Vis bøyninger
        </button>

        <button
          type="submit"
          class="btn btn-warning"
          style="margin:5px;"
          @click="updateOppslag"
        >
          Oppdater
        </button>
        <div class="hidden">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <div class="edit-form">
          <h4>Oppslag</h4>
          <form style="text-align: left;">
            <div class="form-group">
              <label for="lemma_id">Lemma ID</label>
              <input
                type="text"
                class="form-control"
                id="lemma_id"
                v-model="currentOppslag.lemma_id"
                readonly
              />
            </div>
            <div class="form-group">
              <label for="oppslag">Oppslagsord</label>
              <input
                type="text"
                class="form-control"
                id="oppslag"
                v-model="currentOppslag.oppslag"
                readonly
              />
            </div>
            <div class="form-group">
              <label for="ordklasse">Hovedordklasse</label>
              <input
                type="text"
                class="form-control"
                id="ordklasse"
                v-model="currentOppslag.boy_tabell"
                readonly
              />
            </div>
            <div class="form-group">
              <label for="ledd">Ledd</label>
              <input
                type="text"
                class="form-control"
                id="ledd"
                v-model="currentOppslag.ledd"
              />
            </div>
            <div class="form-group">
              <label for="notis">Notis</label>
              <input
                type="text"
                class="form-control"
                id="notis"
                v-model="currentOppslag.notis"
              />
            </div>
            <div class="form-group">
              <label for="uttale">Uttale</label>
              <div
                v-for="(ut,index) in currentOppslag.uttale"
                v-bind:key="index"
              >
                <input
                  type="text"
                  class="form-control"
                  v-model="ut.transkripsjon"
                />
              </div>
            </div>
            <div style="text-align:center;">
              <button
                type="button"
                class="btn btn-success btn-sm mr-1"
                @click="addUttale"
              ><i class="fa-plus fa"></i> </button>
              <button
                type="button"
                class="btn btn-danger btn-sm mr-1"
                @click="removeUttale"
              ><i class="fa fa-minus-circle"></i></button>
            </div>
            <div class="form-group">
              <label for="Definisjoner">Definisjoner</label>
              <div
                v-for="(def,index) in currentOppslag.definisjon"
                v-bind:key="index"
                class="input-group"
              >
                <input
                  type="text"
                  class="form-control"
                  v-model="def.definisjon"
                />
              </div>
            </div>
            <div style="text-align:center;">
              <button
                type="button"
                class="btn btn-success btn-sm mr-1"
                @click="addDef"
              ><i class="fa fa-plus"></i> </button>
              <button
                type="button"
                class="btn btn-danger btn-sm mr-1"
                @click="removeDef"
              ><i class="fa fa-minus-circle"></i></button>
            </div>
          </form>

        </div>
      </div>
      <div class="col-md-6">
        <h4>Kommentarer</h4>
        <div
          class="form-group"
          style="text-align: left"
        >
          <label for="comment">Ny kommentar:</label>
          <textarea
            class="form-control "
            style="width: 100%;"
            rows="5"
            id="comment"
            v-model="nyKommentar"
          ></textarea>
        </div>
        <div class="card-deck">
          <div
            class="card mb-3"
            style="text-align: left"
            v-for="(kom) in currentOppslag.kommentar"
            v-bind:key="kom.kom_id"
          >
            <div class="card-header">
              <span style="text-align: left"> {{ kom.bruker}} </span><span style="float: right">{{ new Date(kom.opprettet).toLocaleString("da-DK")}}</span>
            </div>
            <div class="card-body">
              <p class="card-text">{{ kom.kommentar}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import JishoDataService from "../services/JishoDataService";
import Boyningstabell from '../components/Boyningstabell.vue';

export default {
  name: "endre_oppslag",
  components: {
    Boyningstabell,
  },
  data () {
    return {
      currentOppslag: null,
      nyKommentar: "",
      deleteData: {
        def: [],
        uttale: []
      },
      tabellSynlig: false,
      message: '',
    };
  },
  methods: {
    getOppslag (id) {
      JishoDataService.get(id)
        .then(response => {
          this.currentOppslag = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getKommentarer (id) {
      JishoDataService.get_kommentarer(id)
        .then(response => {
          this.$set(this.currentOppslag, 'kommentar', response.data)
        })
        .catch(e => {
          console.log(e);
        });
    },
    updateOppslag () {
      this.checkEmpty()
      if (this.nyKommentar != '') {
        this.addKommentar()
      }
      JishoDataService.update(this.currentOppslag.lemma_id, { oppslag: this.currentOppslag, deldata: this.deleteData })
        .then(() => {
          this.message = 'Oppslag oppdatert!'
          this.nyKommentar = ''
          this.deleteData.def = []
          this.deleteData.uttale = []
          this.getOppslag(this.currentOppslag.lemma_id)
          this.getKommentarer(this.currentOppslag.lemma_id)
        })
        .catch(e => {
          console.log(e);
        });

    },
    showModal () {
      this.tabellSynlig = true;
      this.message = '';
    },
    closeModal () {
      this.tabellSynlig = false;
    },
    addDef () {
      this.message = '';

      this.currentOppslag.definisjon.push(
        {
          "def_id": null,
          "lemma_id": this.currentOppslag.lemma_id,
          "prioritet": null,
          "definisjon": ""
        }
      );
    },
    addKommentar () {
      this.message = '';
      this.currentOppslag.kommentar.unshift(
        {
          "kom_id": null,
          "lemma_id": this.currentOppslag.lemma_id,
          "kommentar": this.nyKommentar,
          "bruker": localStorage.getItem("user")
        }
      );
    },
    addUttale () {
      this.message = '';

      this.currentOppslag.uttale.push(
        {
          "uttale_id": null,
          "lemma_id": this.currentOppslag.lemma_id,
          "transkripsjon": ""
        }
      );
    },
    removeDef () {
      this.message = '';
      let delDefArray = this.currentOppslag.definisjon.pop()
      if (delDefArray.def_id) {
        this.deleteData.def.push(delDefArray.def_id)
      }
    },
    removeUttale () {
      this.message = '';
      let delUttaleArray = this.currentOppslag.uttale.pop()
      if (delUttaleArray.uttale_id) {
        this.deleteData.uttale.push(delUttaleArray.uttale_id)
      }
    },
    checkEmpty () {
      if (this.currentOppslag.definisjon.length > 0) {
        if (this.currentOppslag.definisjon[this.currentOppslag.definisjon.length - 1].definisjon == "") {
          this.currentOppslag.definisjon.pop()
        }
      }
      if (this.currentOppslag.uttale.length > 0) {
        if (this.currentOppslag.uttale[this.currentOppslag.uttale.length - 1].transkripsjon == "") {
          this.currentOppslag.uttale.pop()
        }
      }
    },
  },
  mounted () {
    this.message = '';
    this.getOppslag(this.$route.params.id);
    this.getKommentarer(this.$route.params.id);

  }
};
</script>

<style>
.edit-form {
  max-width: 100%;
  margin: auto;
}
.card-deck {
  display: inline-block;
  width: 100%;
}
form label {
  font-weight: bold;
}
</style>