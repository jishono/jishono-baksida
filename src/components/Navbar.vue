<template>
  <v-container>
    <v-app-bar
      clipped-left
      app
      color="primary"
      dark
    >
      <v-badge
        :value="$store.getters.usette_innlegg > 0"
        dot
        overlap
        color="red lighten-1"
        offset-x="17"
        offset-y="16"
        class="hidden-lg-and-up ml-n3"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-badge>
      <router-link
        to="/"
        class="v-toolbar__title"
        tag="div"
      >
        <v-img
          class="hidden-md-and-down"
          :style="{ cursor: 'pointer'}"
          src="@/assets/images/jisho_logo_baksida_35.png"
        ></v-img>
        <span
          class="float-left hidden-lg-and-up"
          v-if="$route.meta.title"
        >{{ $t("navbar." + $route.meta.title) }}</span>

      </router-link>
      <v-spacer></v-spacer>
      <router-link
        to="/"
        tag="div"
        :style="{ cursor: 'pointer'}"
        class="hidden-lg-and-up hidden-xs-only mr-2"
      >
        <v-img src="@/assets/images/jisho_logo_baksida_30.png"></v-img>
      </router-link>

      <div class="hidden-md-and-down">

        <v-btn
          v-for="item in activeMenuItems()"
          :key="item.title"
          :to="item.route"
          @click="item.action ? handleFunctionCall(item.action) : ''; drawer = false"
          text
          small
        >
          <v-badge
            :value="item.title == 'veggen' && $store.getters.usette_innlegg > 0"
            dot
            color="red lighten-1"
            offset-x="10"
            offset-y="6"
          >
            <v-icon left>
              {{ item.icon }}</v-icon>
          </v-badge>
          <span v-if="$i18n.locale == 'no'">{{ $t("navbar." + item.title) }}</span>
          <span
            v-if="$i18n.locale == 'ja'"
            class="nav-button-jap"
          >{{ $t("navbar." + item.title) }}</span>
        </v-btn>

      </div>
      <div class="hidden-xs-only">
        <v-btn
          icon
          small
        >
          <v-img
            @click="skiftLocale()"
            aspect-ratio="1"
            max-height="25px"
            max-width="25px"
            src="@/assets/images/jano.png"
          ></v-img>
        </v-btn>
      </div>
      <v-menu
        v-if="$store.getters.isAdmin"
        right
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            large
            icon
            v-on="on"
          >
            <v-icon>mdi-shield-account</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item to="/admin/users">
            <v-list-item-title>Brukere</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/visits">
            <v-list-item-title>Sidebesøk</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      temporary
      app
    >
      <v-list dense>
        <v-list-item
          v-for="item in activeMenuItems()"
          :key="item.title"
          :to="item.route"
          @click="item.action ? handleFunctionCall(item.action) : ''; drawer = false"
          link
        >
          <v-list-item-action>
            <v-badge
              :value="item.title == 'veggen' && $store.getters.usette_innlegg > 0"
              dot
              color="red lighten-1"
              offset-x="10"
              offset-y="6"
            >
              <v-icon left>
                {{ item.icon }}</v-icon>
            </v-badge>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ $t("navbar." + item.title) }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="skiftLocale()">
          <v-list-item-action>
            <v-img
              aspect-ratio="1"
              max-height="20px"
              max-width="20px"
              src="@/assets/images/jano.png"
            ></v-img>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title> {{ $t("navbar.sprak")}} </v-list-item-title>
          </v-list-item-content>

        </v-list-item>

      </v-list>
      <div class="float-right mr-4">

      </div>
    </v-navigation-drawer>

  </v-container>
</template>


<script>

export default {
  name: 'Navbar',
  data () {
    return {
      drawer: false,
      logged_in: false,
      usette_innlegg: 0,
      nav_items: [

        { title: 'forslag', icon: 'mdi-account-group', route: '/forslag', loggedIn: true, loggedOut: true, adminOnly: false },
        { title: 'oversett', icon: 'mdi-translate', route: '/oversett', loggedIn: true, loggedOut: false, adminOnly: false },
        { title: 'sok', icon: 'mdi-magnify', route: '/sok', loggedIn: true, loggedOut: false, adminOnly: false },
        { title: 'statistikk', icon: 'mdi-chart-bar', route: '/statistikk', loggedIn: true, loggedOut: true, adminOnly: false },
        { title: 'veggen', icon: 'mdi-comment-text-multiple', route: '/veggen', loggedIn: true, loggedOut: true, adminOnly: false },
        { title: 'instruks', icon: 'mdi-help-circle', route: '/instruks', loggedIn: true, loggedOut: true, adminOnly: false },
        { title: 'om', icon: 'mdi-information', route: '/om', loggedIn: true, loggedOut: true, adminOnly: false },
        { title: 'profil', icon: 'mdi-account-circle', route: '/profil', loggedIn: true, loggedOut: false, adminOnly: false },
        { title: 'logg_ut', icon: 'mdi-logout', action: 'logout', route: '/logginn', loggedIn: true, loggedOut: false, adminOnly: false },
        { title: 'registrer', icon: 'mdi-account-plus', route: '/registrer', loggedIn: false, loggedOut: true, adminOnly: false },
        { title: 'logg_inn', icon: 'mdi-login', route: '/logginn', loggedIn: false, loggedOut: true, adminOnly: false },

      ],
    }
  },
  methods: {
    skiftLocale () {
      this.$i18n.locale = this.$i18n.locale == 'no' ? 'ja' : 'no'
    },
    handleFunctionCall (function_name) {
      this[function_name]()
    },
    activeMenuItems () {
      if (this.$store.getters.isAdmin) {
        return this.nav_items.filter(item => {
          return item.loggedIn
        })
      }
      if (this.$store.getters.isLoggedIn) {
        return this.nav_items.filter(item => {
          return item.loggedIn && !item.adminOnly
        })
      } else {
        return this.nav_items.filter(item => {
          return item.loggedOut
        })
      }
    },
    logout () {
      this.$store.dispatch('logout')
    },
  },
  mounted () {

  }
}


</script>

<style scoped>
.nav-button-jap {
  /* font-family: 'Noto Sans Japanese', sans-serif; */
  font-weight: 500;
  font-size: 15px;
}
</style>