import Vue from "vue";
import Router from "vue-router";
import store from "./store"

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/oversikt",
      name: "Oversikt",
      meta: {
        requiresAuth: true,
        title: 'Oversikt'
      },
      component: () => import("./views/Oversikt")
    },
    {
      path: "/endre/:id",
      name: "Endre",
      meta: {
        requiresAuth: true,
        title: 'Oversikt'
      },
      component: () => import("./views/Endre")
    },
    {
      path: "/logginn",
      name: "Logg Inn",
      meta: {
        guest: true,
        title: 'Logg inn'
      },
      component: () => import("./views/LoggInn")
    },
    {
      path: "/registrer",
      name: "Registrer",
      meta: {
        guest: true,
        title: 'Registrer ny bruker'
      },
      component: () => import("./views/Registrer")
    },
    {
      path: "/oversett",
      name: "Oversett",
      alias: "/",
      meta: {
        requiresAuth: true,
        title: 'Oversett'
      },
      component: () => import("./views/Oversett")
    },
    {
      path: "/forslag",
      name: "Forslag",
      meta: {
        requiresAuth: true,
        title: 'Forslagsoversikt'
      },
      component: () => import("./views/Forslag")
    },
    {
      path: "/nytt_forslag/:id",
      name: "Nytt forslag",
      meta: {
        requiresAuth: true,
        title: 'Nytt forslag'
      },
      component: () => import("./views/NyttForslag")
    },
    {
      path: "/statistikk",
      name: "Statistikk",
      meta: {
        requiresAuth: true,
        title: 'Statistikk'
      },
      component: () => import("./views/Statistikk")
    },
    {
      path: "/instruks",
      name: "Instruks",
      meta: {
        requiresAuth: true,
        title: 'Instruks'
      },
      component: () => import("./views/Instruks")
    },
    {
      path: "/om",
      name: "Om",
      meta: {
        requiresAuth: true,
        title: 'Om baksida'
      },
      component: () => import("./views/Om")
    },
    {
      path: "/profil",
      name: "Profil",
      meta: {
        requiresAuth: true,
        title: 'Profil'
      },
      component: () => import("./views/Profil")
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
    document.title = to.meta.title + ' | jisho.no - Baksida';
  }
});

export default router