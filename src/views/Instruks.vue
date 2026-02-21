<template>
  <v-container>
    <v-row justify="center">
      <v-col md="7" sm="10" cols="12">
        <InstruksBoks> </InstruksBoks>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";

import InstruksBoks from "../components/InstruksBoks.vue";

export default defineComponent({
  name: "instruks",

  data() {
    return {};
  },
  components: {
    InstruksBoks,
  },
});
</script>
