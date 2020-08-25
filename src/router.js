import Vue from "vue";
import Router from "vue-router";
import store from "./store"
import i18n from '@/i18n'

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/sok",
      meta: {
        requiresAuth: true,
        title: 'sok'
      },
      component: () => import("./views/Sok")
    },
    {
      path: "/endre/:id",
      meta: {
        requiresAuth: true,
        title: 'endre'
      },
      component: () => import("./views/Endre")
    },
    {
      path: "/logginn",
      meta: {
        guest: true,
        title: 'logg_inn'
      },
      component: () => import("./views/LoggInn")
    },
    {
      path: "/registrer",
      meta: {
        guest: true,
        title: 'registrer'
      },
      component: () => import("./views/Registrer")
    },
    {
      path: "/oversett",
      meta: {
        requiresAuth: true,
        title: 'oversett'
      },
      component: () => import("./views/Oversett")
    },
    {
      path: "/forslag",
      alias: "/",
      meta: {
        requiresAuth: true,
        title: 'forslag'
      },
      component: () => import("./views/Forslag")
    },
    {
      path: "/forslag/:id/kommentarer",
      meta: {
        requiresAuth: true,
        title: 'forslag'
      },
      component: () => import("./views/Forslag")
    },
    {
      path: "/nytt_forslag/:id",
      meta: {
        requiresAuth: true,
        title: 'nytt_forslag'
      },
      component: () => import("./views/NyttForslag")
    },
    {
      path: "/statistikk",
      meta: {
        requiresAuth: true,
        title: 'statistikk'
      },
      component: () => import("./views/Statistikk")
    },
    {
      path: "/instruks",
      meta: {
        requiresAuth: true,
        title: 'instruks'
      },
      component: () => import("./views/Instruks")
    },
    {
      path: "/om",
      meta: {
        requiresAuth: false,
        title: 'om'
      },
      component: () => import("./views/Om")
    },
    {
      path: "/profil",
      meta: {
        requiresAuth: true,
        title: 'profil'
      },
      component: () => import("./views/Profil")
    },
    {
      path: "/veggen",
      meta: {
        requiresAuth: true,
        title: 'veggen'
      },
      component: () => import("./views/Veggen")
    },
    {
      path: "/veggen/:id",
      meta: {
        requiresAuth: true,
        title: 'veggen'
      },
      component: () => import("./views/Veggen")
    },
    {
      path: "/admin/users",
      meta: {
        requiresAuth: true,
        title: 'users'
      },
      component: () => import("./views/Users")
    },
    {
      path: "/*",
      redirect: '/'
    },
  ]

})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next({
        path: '/logginn',
        params: { nextUrl: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') == null) {
      next()
    }
    else {
      next({ name: 'oversikt' })
    }
  } else {
    next()
  }
})

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    Vue.nextTick(() => {
      document.title = i18n.t('navbar.' + to.meta.title) + ' | jisho.no - Baksida';
    })
  }
  store.dispatch('refresh_usette_innlegg')
});

export default router