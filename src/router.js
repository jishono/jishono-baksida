import { createRouter, createWebHistory } from "vue-router";
import { nextTick } from "vue";
import i18n from "./i18n";
import store from "./store";
import Sok from "./views/Sok.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/sok",
      meta: {
        requiresAuth: true,
        title: 'sok'
      },
      component: Sok
    },
    {
      path: "/sok/:query",
      meta: {
        requiresAuth: true,
        title: 'sok'
      },
      component: Sok
    },
    {
      path: "/endre/:id",
      meta: {
        requiresAuth: true,
        title: 'endre'
      },
      component: () => import("./views/Endre.vue")
    },
    {
      path: "/logginn",
      meta: {
        guest: true,
        title: 'logg_inn'
      },
      component: () => import("./views/LoggInn.vue")
    },
    {
      path: "/registrer",
      meta: {
        guest: true,
        title: 'registrer'
      },
      component: () => import("./views/Registrer.vue")
    },
    {
      path: "/oversett",
      meta: {
        requiresAuth: true,
        title: 'oversett'
      },
      component: () => import("./views/Oversett.vue")
    },
    {
      path: "/forslag",
      alias: "/",
      meta: {
        requiresAuth: false,
        title: 'forslag'
      },
      component: () => import("./views/Forslag.vue")
    },
    {
      path: "/forslag/:id/kommentarer",
      meta: {
        requiresAuth: false,
        title: 'forslag'
      },
      component: () => import("./views/Forslag.vue")
    },
    {
      path: "/nytt_forslag/:id",
      meta: {
        requiresAuth: true,
        title: 'nytt_forslag'
      },
      component: () => import("./views/NyttForslag.vue")
    },
    {
      path: "/statistikk",
      meta: {
        requiresAuth: false,
        title: 'statistikk'
      },
      component: () => import("./views/Statistikk.vue")
    },
    {
      path: "/instruks",
      meta: {
        requiresAuth: false,
        title: 'instruks'
      },
      component: () => import("./views/Instruks.vue")
    },
    {
      path: "/om",
      meta: {
        requiresAuth: false,
        title: 'om'
      },
      component: () => import("./views/Om.vue")
    },
    {
      path: "/profil",
      meta: {
        requiresAuth: true,
        title: 'profil'
      },
      component: () => import("./views/Profil.vue")
    },
    {
      path: "/veggen",
      meta: {
        requiresAuth: false,
        title: 'veggen'
      },
      component: () => import("./views/Veggen.vue")
    },
    {
      path: "/veggen/:id",
      meta: {
        requiresAuth: true,
        title: 'veggen'
      },
      component: () => import("./views/Veggen.vue")
    },
    {
      path: "/nytt_oppslag/:oppslag",
      meta: {
        requiresAuth: true,
        title: 'new_word'
      },
      component: () => import("./views/NyttOppslag.vue")
    },
    {
      path: "/nytt_oppslag/id/:id",
      meta: {
        requiresAuth: true,
        title: 'new_word'
      },
      component: () => import("./views/NyttOppslag.vue")
    },
    {
      path: "/oppslag_forslag",
      meta: {
        requiresAuth: true,
        title: 'word_suggestion_list'
      },
      component: () => import("./views/WordSuggestionList.vue")
    },
    {
      path: "/admin/users",
      meta: {
        requiresAuth: true,
        title: 'users'
      },
      component: () => import("./views/Users.vue")
    },
    {
      path: "/admin/visits",
      meta: {
        requiresAuth: true,
        title: 'visits'
      },
      component: () => import("./views/PageVisits.vue")
    },
    {
      path: "/:pathMatch(.*)*",
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
    nextTick(() => {
      document.title = i18n.global.t('navbar.' + to.meta.title) + ' | jisho.no - Baksida';
    })
  }
});

export default router
