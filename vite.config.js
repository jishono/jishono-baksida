import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Vuetify from 'vite-plugin-vuetify'


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), Vuetify()],
})
