import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
    user_id: localStorage.getItem('user_id') || null,
    admin: localStorage.getItem('admin') || null,
    snackbar: {
      text: '',
      color: '',
    },
    boy_ok: ['adj', 'adv', 'det', 'pron', 'subst', 'verb'],
    forslag_status: {
      0: {
        text: 'Til avstemning',
        color: 'orange'
      },
      1: {
        text: 'Godkjent ved avstemning',
        color: 'green'
      },
      2: {
        text: 'Godkjent av admin',
        color: 'green'
      },
      3: {
        text: 'Endret og godkjent av admin',
        color: 'green'
      },
      4: {
        text: 'Avvist ved avstemning',
        color: 'red'
      },
      5: {
        text: 'Avvist av admin',
        color: 'red'
      }
    }
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
    }
  },
  actions: {
    async login ({ commit }, login_data) {
      commit('auth_request')
      try {
        const res = await api.post('/logg_inn', login_data)
        const token = res.data.token
        const username = res.data.username
        const user_id = res.data.user_id
        const admin = res.data.admin
        localStorage.setItem('token', token)
        localStorage.setItem('username', username)
        localStorage.setItem('user_id', user_id)
        localStorage.setItem('admin', admin)
        commit('auth_success', { token: token, user_id: user_id, username: username, admin: admin })
      } catch (error) {
        commit('auth_error')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('user_id')
        localStorage.removeItem('admin')
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
    show_snackbar ({ commit}, snackbar_data) {
      commit('set_snackbar', snackbar_data)
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    isAdmin: state => state.admin == 1,
    token: state => state.token,
    username: state => state.username,
    user_id: state => state.user_id,
    boy_ok: state => state.boy_ok,
    status_text: state => status => {
      return state.forslag_status[status].text
    },
    status_color: state => status => {
      return state.forslag_status[status].color
    },
    snackbar: state => state.snackbar,

  }
});
