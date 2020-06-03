import Vue from "vue";
import Router from "vue-router";

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
      path: "/login",
      name: "Login",
      meta: {
        guest: true
      },
      component: () => import("./components/Login")
    },
  ]

})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/login',
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