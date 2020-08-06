import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store';
import i18n from './i18n'
import VueSimpleMarkdown from 'vue-simple-markdown'
/* import 'vue-simple-markdown/dist/vue-simple-markdown.css' */
 
Vue.use(VueSimpleMarkdown)

Vue.config.productionTip = false

/* import "@/assets/css/global.css" */

new Vue({
  router,
  vuetify,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
