import { createStore } from 'vuex';
import api from '../api';
import i18n from "../i18n.js";
import JishoDataService from "../services/JishoDataService";

export default createStore({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
    user_id: localStorage.getItem('user_id') || null,
    admin: localStorage.getItem('admin') || null,
    locale: localStorage.getItem('locale') || import.meta.env.VITE_I18N_LOCALE || 'no',
    snackbar: {
      text: '',
      color: '',
    },
    boy_ok: ['adj', 'adv', 'det', 'pron', 'subst', 'verb'],
    usette_innlegg: 0
  },
  mutations: {
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, payload) {
      state.status = 'success'
      state.token = payload.token
      state.username = payload.username
      state.user_id = payload.user_id
      state.admin = payload.admin
      state.locale = payload.locale
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.token = ''
      state.admin = null
    },
    set_snackbar (state, payload) {
      /* state.snackbar.text = payload.text
      state.snackbar.color = payload.color
      state.snackbar.show = true */
      state.snackbar = payload
    },
    set_locale (state, payload) {
      state.locale = payload
      i18n.global.locale.value = payload

    },
    set_usette_innlegg (state, payload) {
      state.usette_innlegg = payload
    }
  },
  actions: {
    async login ({ commit, dispatch }, login_data) {
      commit('auth_request')
      try {
        const res = await api.post('/logg_inn', login_data)
        const token = res.data.token
        const username = res.data.username
        const user_id = res.data.user_id
        const admin = res.data.admin
        const locale = res.data.locale
        localStorage.setItem('token', token)
        localStorage.setItem('username', username)
        localStorage.setItem('user_id', user_id)
        localStorage.setItem('admin', admin)
        localStorage.setItem('locale', locale)
        commit('auth_success', { token: token, user_id: user_id, username: username, admin: admin, locale: locale })
        dispatch('refresh_usette_innlegg')
      } catch (error) {
        commit('auth_error')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('user_id')
        localStorage.removeItem('admin')
        localStorage.removeItem('locale')
        throw error
      }
    },
    async logout ({ commit }) {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('user_id')
      localStorage.removeItem('admin')
      commit('logout')
    },
    show_snackbar ({ commit }, snackbar_data) {
      commit('set_snackbar', snackbar_data)
    },
    set_locale ({ commit }, language) {
      localStorage.setItem('locale', language)
      commit('set_locale', language)
    },
    async refresh_usette_innlegg ({ commit }) {
      const antall = await JishoDataService.hentUsetteVeggeninnlegg()
      commit('set_usette_innlegg', antall.data.usette_innlegg)
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    isAdmin: state => state.admin,
    token: state => state.token,
    username: state => state.username,
    user_id: state => state.user_id,
    boy_ok: state => state.boy_ok,
    snackbar: state => state.snackbar,
    locale: state => state.locale,
    usette_innlegg: state => state.usette_innlegg,

  }
});
