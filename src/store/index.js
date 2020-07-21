import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: localStorage.getItem('user') || '',
    admin: localStorage.getItem('admin') || null,
    boy_ok: ['adj','adv','det','pron','subst','verb']
  },
  mutations: {
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, payload) {
      state.status = 'success'
      state.token = payload.token
      state.user = payload.user
      state.admin = payload.admin
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.token = ''
      state.admin = null
    },
  },
  actions: {
    async login ({ commit}, login_data) {
      commit('auth_request')
      try {
        const res = await api.post('/logg_inn', login_data)
        const token = res.data.token
        const user = res.data.user
        const admin = res.data.admin
        localStorage.setItem('token', token)
        localStorage.setItem('user', user)
        localStorage.setItem('admin', admin)
        commit('auth_success', { token: token, user: user, admin: admin })
      } catch (error) {
        commit('auth_error')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        throw error
      }
    },
    async logout ({ commit }) {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('admin')
      commit('logout')
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    isAdmin: state => state.admin == 1,
    token: state => state.token,
    user: state => state.user,
    boy_ok: state => state.boy_ok

  }
});
