import { createApp } from 'vue';
import 'vuetify/styles';
import App from './App.vue';
import './assets/css/global.css';
import i18n from './i18n.js';
import { vuetify } from './plugins/vuetify';
import router from './router';
import store from './store';
 

createApp(App).use(router).use(vuetify).use(store).use(i18n).mount('#app')
