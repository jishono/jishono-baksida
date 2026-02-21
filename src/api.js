import axios from "axios";
import i18n from "./i18n.js";
import store from "./store";

const api = axios.create({
  baseURL: import.meta.env.VITE_NODE_HOST,
  headers: {
    "Content-type": "application/json",
  }
})

api.interceptors.request.use(
  res => {
    const token = store.getters.token;
    if (token) {
      res.headers["Authorization"] = token;
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
      console.log(error)
      store.dispatch('show_snackbar', { message: i18n.global.t('varsler.server_error'), color: 'error' })
      return new Promise(() => {})
    } 
      return Promise.reject(error);
  }
);

export default api;