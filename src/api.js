import axios from "axios";
import store from "./store"
import i18n from '@/i18n'

const api = axios.create({
  baseURL: process.env.VUE_APP_NODE_HOST,
  headers: {
    "Content-type": "application/json",
  }
})

api.interceptors.request.use(
  res => {
    const token = store.getters.token;
    if (token) {
      res.headers.common["Authorization"] = token;
    }
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  res => { return res },
  error => {
    if (!error.response || error.response.status == 502) {
      store.dispatch('show_snackbar', { message: i18n.t('varsler.server_error'), color: 'error' })
  }

    return Promise.reject(error);
  }
);

export default api;