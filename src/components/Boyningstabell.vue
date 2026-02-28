<template>
  <v-dialog :model-value="boyningsDialog" @click:outside="close()" @update:model-value="close()">
    <v-card>
      <v-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th v-for="header in headers" :key="header">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in boyningstabeller" :key="index">
              <td v-for="(element, index) in row" :key="index">
                {{ element }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";

import JishoDataService from "../services/JishoDataService";

export default defineComponent({
  emits: ["update:boyningsDialog"],
  name: "Boyningstabell",

  props: {
    lemma_id: Number,
    boyningsDialog: {
      default: false,
    },
  },

  data() {
    return {
      boyningstabeller: null,
      headers: [],
    };
  },

  methods: {
    getBoyning() {
      if (!this.lemma_id) return;
      JishoDataService.get_boyning(this.lemma_id)
        .then((response) => {
          this.boyningstabeller = response.data;
          this.headers = [];
          Object.keys(this.boyningstabeller[0]).forEach((label) => {
            this.headers.push(label);
          });
          this.headers[0] = "id";
          this.headers[2] = "prdgm";
          this.headers[3] = "skjema";
          this.addArticles();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addArticles() {
      for (let row of this.boyningstabeller) {
        if (row.pos[0] === "m") {
          row.ubestemt_entall = "en " + row.ubestemt_entall;
        } else if (row.pos[0] === "f") {
          row.ubestemt_entall = "ei " + row.ubestemt_entall;
        } else if (row.pos[0] === "n") {
          row.ubestemt_entall = "et " + row.ubestemt_entall;
        } else if (row.pos[0] === "v") {
          row.infinitiv = "å " + row.infinitiv;
          row.presens_perfektum = "har " + row.presens_perfektum;
        }
      }
    },
    close() {
      this.$emit("update:boyningsDialog", false);
    },
  },

  watch: {
    lemma_id: function () {
      this.getBoyning();
    },
  },

  mounted() {
    this.getBoyning();
  },
});
</script>
