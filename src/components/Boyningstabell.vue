<template>
  <v-dialog
    v-model="boyningsDialog"
    @click:outside="close()"
  >
    <v-card>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th
                v-for="header in headers"
                :key="header"
              >{{header}}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in boyningstabeller"
              :key="index"
            >
              <td
                v-for="(element, index) in row"
                :key="index"
              >{{element}}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-dialog>
</template>

<script>
import JishoDataService from "../services/JishoDataService";

export default {
  name: "Boyningstabell",
  props: {
    lemma_id: Number,
    boyningsDialog: {
      default: false
    }
  },
  data () {
    return {
      boyningstabeller: null,
      headers: [],
    };
  },
  methods: {
    getBoyning () {
      JishoDataService.get_boyning(this.lemma_id)
        .then(response => {
          console.log(response.data);
          this.boyningstabeller = response.data
          Object.keys(this.boyningstabeller[0]).forEach(label => {
            this.headers.push(label);
          })
          this.headers[0] = "id"
          this.headers[2] = "prdgm"
          this.headers[3] = "skjema"

        })
        .catch(e => {
          console.log(e);
        });
    },
    close () {
      this.$emit('update:boyningsDialog', false)
    }
  },
  mounted () {
    this.getBoyning();
  },
};

</script>
