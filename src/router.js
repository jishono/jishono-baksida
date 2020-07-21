import Vue from "vue";
import Router from "vue-router";
import store from "./store"

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/oversikt",
      alias: "/",
      name: "oversikt",
      meta: {
        requiresAuth: true
      },
      component: () => import("./components/Oversikt")
    },
    {
      path: "/endre/:id",
      name: "endre",
      meta: {
        requiresAuth: true
      },
      component: () => import("./components/Endre")
    },
    {
      path: "/logginn",
      name: "LoggInn",
      meta: {
        guest: true
      },
      component: () => import("./components/LoggInn")
    },
    {
      path: "/registrer",
      name: "Registrer",
      meta: {
        guest: true
      },
      component: () => import("./components/Registrer")
    },
    {
      path: "/oversett",
      name: "Oversett",
      meta: {
        requiresAuth: true
      },
      component: () => import("./components/Oversett")
    },
    {
      path: "/forslag",
      name: "Forslagg",
      meta: {
        requiresAuth: true
      },
      component: () => import("./components/Forslag")
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

export default router