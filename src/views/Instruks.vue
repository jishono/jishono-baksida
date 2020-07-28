<template>
  <v-container class="pa-0">

    <v-row
      justify="center"
      no-gutters
    >
      <v-col
        md=6
        sm=10
        cols=12
      >
      <InstruksBoks>

      </InstruksBoks>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import InstruksBoks from '../components/InstruksBoks.vue'

export default {
  name: 'instruks',
  data () {
    return {

    }
  },
  components: {
      InstruksBoks
  },
  methods: {

  },
  mounted () {

  }
}

</script>