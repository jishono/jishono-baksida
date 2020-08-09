<template>
  <v-app>
    <Navbar :key="$route.fullPath"></Navbar>
    <Snackbar></Snackbar>
    <v-container
      fluid
      class="pa-0 ma-0"
    >
      <v-row
        align="center"
        justify="center"
        no-gutters
      >
        <v-col
          sm=12
          md=12
          lg=10
          xl=8
          class="ma-0 px-0"
        >
          <v-main>
            <router-view :key="$route.fullPath" />
          </v-main>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar'
import Snackbar from './components/Snackbar'

export default {
  name: 'app',
  components: {
    Navbar,
    Snackbar
  },
  methods: {
    
  }
}
</script>

