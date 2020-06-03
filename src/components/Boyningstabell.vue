<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <slot name="header">
          <button
            type="button"
            class="btn-close"
            @click="close"
          >
            x
          </button>
        </slot>
      </header>
      <section class="modal-body">
        <div style="width: 120%">
          <vue-table-dynamic
            :params="params"
            ref="table"
          ></vue-table-dynamic>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import JishoDataService from "../services/JishoDataService";
import VueTableDynamic from 'vue-table-dynamic';
//import Vue from 'vue';

export default {
  name: "Boyningstabell",
  components: { VueTableDynamic },
  props: {
    lemma_id: Number
    },
  data () {
    return {
      boyningstabell: null,
      params: {
        data: [],
        header: 'row',
        border: true,
        stripe: true,
        columnWidth: [{ column: 0, width: 60 }, { column: 1, width: 40 }, { column: 2, width: 50 }, { column: 3, width: 40 }],
      }
    };
  },
  methods: {
    getBoyning () {
      JishoDataService.get_boyning(this.lemma_id, this.boy_tabell)
        .then(response => {
          console.log(response.data);
          this.boyningstabell = response.data
          let labelrow = []
          Object.keys(this.boyningstabell[0]).forEach(label => {
            labelrow.push(label);
          });
          labelrow[0] = "id"
          labelrow[2] = "prdgm"
          labelrow[3] = "skjema"
          this.params.data.push(labelrow);

          this.boyningstabell.forEach(row => {
            labelrow = []
            Object.values(row).forEach(value => {
              labelrow.push(value);
            });
            this.params.data.push(labelrow);
          })

          console.log(this.params.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    close () {
      this.$emit('close');
    }
  },
  mounted () {
    this.getBoyning();
    console.log(this.id)
    //this.getBoyning(this.$route.params.id);
  },
};

</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 30%;
  align-items: center;
}

.modal-header {
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  border: none;
  font-size: 20px;
  padding: 20px;
  cursor: pointer;
  font-weight: bold;
  color: #4aae9b;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4aae9b;
  border: 1px solid #4aae9b;
  border-radius: 2px;
}
</style>