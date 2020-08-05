 <template>
  <v-snackbar
    v-model="show"
    :timeout="timeout"
    :color="color"
    top
  >
    {{ message[$i18n.locale] }}
  </v-snackbar>
</template>

<script>
export default {
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
  }
}


</script>