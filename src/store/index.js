import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: localStorage.getItem('user') || '',
  },
  mutations: {
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, payload) {
      state.status = 'success'
      state.token = payload.token
      state.user = payload.user
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.token = ''
    },
  },
  actions: {
    async login ({ commit}, login_data) {
      commit('auth_request')
      try {
        const res = await api.post('/login', login_data)
        const token = res.data.token
        const user = res.data.user
        localStorage.setItem('token', token)
        localStorage.setItem('user', user)
        commit('auth_success', { token: token, user: user })
      } catch (error) {
        commit('auth_error')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
    async logout ({ commit }) {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      commit('logout')
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    token: state => state.token,
    user: state => state.user
  }
});
