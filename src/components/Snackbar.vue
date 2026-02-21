 <template>
  <v-snackbar
    v-model="show"
    :timeout="timeout"
    :color="color"
    location="top"
  >
    <span v-if="typeof message == 'string'">{{ message }} </span>
    <span v-else>{{ message[$i18n.locale] }}</span>
  </v-snackbar>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'snackbar',

  data () {
    return {
      timeout: 3000,
      message: '',
      color: '',
      show: false
    }
  },

  computed: {
    snackbar_text () { return this.$store.getters.snackbar_text },
    snackbar_color () { return this.$store.getters.snackbar_color },
    snackbar_show () {
      return this.$store.getters.snackbar_show
    },
    snackbar () {
      return this.$store.getters.snackbar
    }
  },

  watch: {
    snackbar (updated_snackbar) {
      this.message = updated_snackbar.message
      this.color = updated_snackbar.color
      this.show = true
    }
  },
});
</script>