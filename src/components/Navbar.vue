<template>
  <v-container>
    <v-app-bar color="primary" theme="dark" class="pr-3">
      <v-badge
        :model-value="$store.getters.usette_innlegg > 0"
        dot
        overlap
        color="red-lighten-1"
        offset-x="17"
        offset-y="16"
        class="d-lg-none ml-n3"
      >
        <v-app-bar-nav-icon class="ml-3" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-badge>
      <router-link to="/" class="v-toolbar__title d-none d-lg-flex align-center">
        <img
          class="ml-3"
          :style="{ cursor: 'pointer' }"
          :src="jishoLogo"
        />
      </router-link>
      <span class="d-lg-none text-white font-weight-bold text-h6 ml-2" v-if="$route.meta.title">{{
        $t("navbar." + $route.meta.title)
      }}</span>
      <v-spacer></v-spacer>
      <router-link
        to="/"
        :style="{ cursor: 'pointer' }"
        class="d-none d-sm-flex d-lg-none mr-2 align-center"
      >
        <img :src="jishoLogoSmall" />
      </router-link>

      <div class="d-none d-lg-block">
        <v-btn
          v-for="item in activeMenuItems()"
          :key="item.title"
          :to="item.route"
          @click="
            item.action ? handleFunctionCall(item.action) : '';
            drawer = false;
          "
          variant="text"
          size="small"
        >
          <v-badge
            :model-value="
              item.title == 'veggen' && $store.getters.usette_innlegg > 0
            "
            dot
            color="red-lighten-1"
            offset-x="10"
            offset-y="6"
          >
            <v-icon start size="24"> {{ item.icon }}</v-icon>
          </v-badge>
          <span v-if="$i18n.locale == 'no'">{{
            $t("navbar." + item.title)
          }}</span>
          <span v-if="$i18n.locale == 'ja'" class="nav-button-jap">{{
            $t("navbar." + item.title)
          }}</span>
        </v-btn>
      </div>
      <div class="d-none d-sm-block">
        <v-btn icon size="small" @click="skiftLocale()">
          <img
            style="max-height: 25px; max-width: 25px;"
            :src="jaNoLogo"
          ></img>
          </v-btn>
      </div>
      <v-menu v-if="$store.getters.isAdmin">
        <template v-slot:activator="{ props }">
          <v-btn size="large" icon v-bind="props" class="mr-2">
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
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in activeMenuItems()"
          :key="item.title"
          :to="item.route"
          @click="
            item.action ? handleFunctionCall(item.action) : '';
            drawer = false;
          "
          link
        >
          <template v-slot:prepend>
            <v-badge
              :model-value="item.title == 'veggen' && $store.getters.usette_innlegg > 0"
              dot
              color="red-lighten-1"
              offset-x="10"
              offset-y="6"
            >
              <v-icon>{{ item.icon }}</v-icon>
            </v-badge>
          </template>
          <v-list-item-title>{{
            $t("navbar." + item.title)
          }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="skiftLocale()">
          <template v-slot:prepend>
            <img
              :src="jaNoLogo"
              alt="Language Flag"
              style="max-height: 20px; max-width: 20px"
            />
          </template>
          <v-list-item-title> {{ $t("navbar.sprak") }} </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script setup>
import jaNoLogo from "../assets/jano.png";
import jishoLogo from "../assets/jisho_logo_baksida_35.png";
import jishoLogoSmall from "../assets/jisho_logo_baksida_30.png";
</script>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Navbar",

  data() {
    return {
      drawer: false,
      logged_in: false,
      usette_innlegg: 0,
      nav_items: [
        {
          title: "forslag",
          icon: "mdi-account-group",
          route: "/forslag",
          loggedIn: true,
          loggedOut: true,
          adminOnly: false,
        },
        {
          title: "oversett",
          icon: "mdi-translate",
          route: "/oversett",
          loggedIn: true,
          loggedOut: false,
          adminOnly: false,
        },
        {
          title: "sok",
          icon: "mdi-magnify",
          route: "/sok",
          loggedIn: true,
          loggedOut: false,
          adminOnly: false,
        },
        {
          title: "statistikk",
          icon: "mdi-chart-bar",
          route: "/statistikk",
          loggedIn: true,
          loggedOut: true,
          adminOnly: false,
        },
        {
          title: "veggen",
          icon: "mdi-comment-text-multiple",
          route: "/veggen",
          loggedIn: true,
          loggedOut: true,
          adminOnly: false,
        },
        {
          title: "instruks",
          icon: "mdi-help-circle",
          route: "/instruks",
          loggedIn: true,
          loggedOut: true,
          adminOnly: false,
        },
        {
          title: "om",
          icon: "mdi-information",
          route: "/om",
          loggedIn: true,
          loggedOut: true,
          adminOnly: false,
        },
        {
          title: "profil",
          icon: "mdi-account-circle",
          route: "/profil",
          loggedIn: true,
          loggedOut: false,
          adminOnly: false,
        },
        {
          title: "logg_ut",
          icon: "mdi-logout",
          action: "logout",
          route: "/logginn",
          loggedIn: true,
          loggedOut: false,
          adminOnly: false,
        },
        {
          title: "registrer",
          icon: "mdi-account-plus",
          route: "/registrer",
          loggedIn: false,
          loggedOut: true,
          adminOnly: false,
        },
        {
          title: "logg_inn",
          icon: "mdi-login",
          route: "/logginn",
          loggedIn: false,
          loggedOut: true,
          adminOnly: false,
        },
      ],
    };
  },

  methods: {
    skiftLocale() {
      this.$i18n.locale = this.$i18n.locale == "no" ? "ja" : "no";
    },
    handleFunctionCall(function_name) {
      this[function_name]();
    },
    activeMenuItems() {
      if (this.$store.getters.isAdmin) {
        return this.nav_items.filter((item) => {
          return item.loggedIn;
        });
      }
      if (this.$store.getters.isLoggedIn) {
        return this.nav_items.filter((item) => {
          return item.loggedIn && !item.adminOnly;
        });
      } else {
        return this.nav_items.filter((item) => {
          return item.loggedOut;
        });
      }
    },
    logout() {
      this.$store.dispatch("logout");
    },
  },

  mounted() {},
});
</script>

<style scoped>
.nav-button-jap {
  /* font-family: 'Noto Sans Japanese', sans-serif; */
  font-weight: 500;
  font-size: 15px;
}
</style>
