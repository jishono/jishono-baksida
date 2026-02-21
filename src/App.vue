<template>
  <v-app>
    <Navbar></Navbar>
    <Snackbar></Snackbar>
    <v-container fluid class="pa-0 ma-0">
      <v-row align="center" justify="center" no-gutters>
        <v-col sm="12" md="12" lg="10" xl="8" class="ma-0 px-0">
          <v-main>
            <router-view :key="$route.fullPath" />
          </v-main>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { defineComponent } from "vue";

import Navbar from "./components/Navbar.vue";
import Snackbar from "./components/Snackbar.vue";
import JishoDataService from "./services/JishoDataService";

export default defineComponent({
  name: "app",

  components: {
    Navbar,
    Snackbar,
  },

  data() {
    return {
      PollerLastSeen: null,
      PollerWallPosts: null,
    };
  },

  methods: {
    updateLastSeen() {
      if (this.$store.getters.isLoggedIn) {
        JishoDataService.updateLastSeen(this.$store.getters.user_id);
      }
      this.PollerLastSeen = setInterval(() => {
        if (this.$store.getters.isLoggedIn) {
          JishoDataService.updateLastSeen(this.$store.getters.user_id);
        }
      }, 1800000);
    },
    updateUnseenWallposts() {
      if (this.$store.getters.isLoggedIn) {
        this.$store.dispatch("refresh_usette_innlegg");
      }
      this.PollerWallPosts = setInterval(() => {
        if (this.$store.getters.isLoggedIn) {
          this.$store.dispatch("refresh_usette_innlegg");
        }
      }, 120000);
    },
  },

  beforeUnmount() {
    clearInterval(this.PollerLastSeen);
    clearInterval(this.PollerWallPosts);
  },

  created() {
    this.updateLastSeen();
    this.updateUnseenWallposts();
  },
});
</script>
