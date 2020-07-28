<template>
  <v-container fluid class="pa-0">
    <v-row
      align="center"
      justify="center"
      np-gutters
    >
      <v-col
        sm=8
        cols=12
      >
      <Sok>

      </Sok>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Sok from "../components/Sok.vue";

export default {
  name: "Oversikt",
  components: {
    Sok
  },
  data () {
    return {
    };
  },



};
</script>