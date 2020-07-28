<template>
  <v-container>
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="hidden-md-and-up"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="hidden-sm-only hidden-xs-only">
        jisho.no - Baksida
      </v-toolbar-title>
      <v-toolbar-title class="hidden-md-and-up hidden-xs-only">
        <span class="float-left">{{ $route.name }}</span>

      </v-toolbar-title>
      <v-toolbar-title class="hidden-sm-and-up">
        {{ $route.name }}
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <span class="hidden-md-and-up mr-2">jisho.no - Baksida</span>
      <div class="hidden-sm-only hidden-xs-only">
        <v-btn
          v-for="item in activeMenuItems()"
          :key="item.title"
          :to="item.route"
          @click="item.action ? handleFunctionCall(item.action) : ''; drawer = false"
          text
          small
        >
          <v-icon
            left
            dark
          >
          {{ item.icon }}</v-icon>
          <span v-if="$i18n.locale == 'no'">{{ $t("navbar." + item.title) }}</span>
          <span v-if="$i18n.locale == 'ja'" class="nav-button-jap">{{ $t("navbar." + item.title) }}</span>
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
            src="@/assets/jano.png"
          ></v-img>
        </v-btn>
      </div>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
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
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content >
            <v-list-item-title>{{ $t("navbar." + item.title) }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="skiftLocale()">
          <v-list-item-action>
              <v-img
                aspect-ratio="1"
                max-height="20px"
                max-width="20px"
                src="@/assets/jano.png"
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
      closeOnClick: true,
      logged_in: false,
      nav_items: [

        { title: 'oversett', icon: 'mdi-translate', route: '/oversett', loggedIn: true, loggedOut: false, adminOnly: false },
        { title: 'forslag', icon: 'mdi-account-group', route: '/forslag', loggedIn: true, loggedOut: false, adminOnly: false },
        { title: 'statistikk', icon: 'mdi-chart-bar', route: '/statistikk', loggedIn: true, loggedOut: false, adminOnly: false },
        { title: 'oversikt', icon: 'mdi-clipboard-text', route: '/oversikt', loggedIn: true, loggedOut: false, adminOnly: true },
        { title: 'instruks', icon: 'mdi-help-circle', route: '/instruks', loggedIn: true, loggedOut: false, adminOnly: false },
        { title: 'om', icon: 'mdi-information', route: '/om', loggedIn: true, loggedOut: true, adminOnly: false },
        { title: 'profil', icon: 'mdi-account-circle', route: '/profil', loggedIn: true, loggedOut: false, adminOnly: false },
        { title: 'loggut', icon: 'mdi-logout', action: 'logout', route: '/logginn', loggedIn: true, loggedOut: false, adminOnly: false },
        { title: 'registrer', icon: 'mdi-account-plus', route: '/registrer', loggedIn: false, loggedOut: true, adminOnly: false },
        { title: 'logginn', icon: 'mdi-login', route: '/logginn', loggedIn: false, loggedOut: true, adminOnly: false },

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
}


</script>

<style scoped>

.nav-button-jap {
font-family: 'Noto Sans Japanese', sans-serif;
font-weight: 200;
font-size: 16px;
}

</style>