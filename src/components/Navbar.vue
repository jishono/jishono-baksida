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
      <v-toolbar-title>
        jisho.no admin
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <div class="hidden-sm-only hidden-xs-only">
        <v-btn
          v-for="item in activeMenuItems()"
          :key="item.title"
          :to="item.route"
          @click="item.action ? handleFunctionCall(item.action) : ''; drawer = false"
          text
        >

          <v-icon
            left
            dark
          >{{ item.icon }}</v-icon>
          {{ item.title }}
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

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
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
        { title: 'Oversikt', icon: 'mdi-clipboard-text', route: '/oversikt', showLoggedIn: true },
        { title: 'Forslag', icon: 'mdi-account-group', route: '/trust', showLoggedIn: true },
        { title: 'Statistikk', icon: 'mdi-chart-bar', route: '/signup', showLoggedIn: true },
        { title: 'Logg ut', icon: 'mdi-logout', action: 'logout', route: '/login', showLoggedIn: true },
        { title: 'Logg inn', icon: 'mdi-login', route: '/login', showLoggedIn: false },

      ],
    }
  },
  methods: {
    handleFunctionCall (function_name) {
      this[function_name]()
    },
    activeMenuItems () {
      if (this.$store.getters.isLoggedIn) {
        return this.nav_items.filter(item => {
          return item.showLoggedIn
        })
      } else {
        return this.nav_items.filter(item => {
          return !item.showLoggedIn
        })
      }
    },
    logout () {
      this.$store.dispatch('logout')
    },
    isLoggedIn () {
      return this.$root.$data.isLoggedIn()
    }
  },
}


</script>