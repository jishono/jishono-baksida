<template>
  <div class="row">
    <div class="col-md-3 mx-auto">
      <h2>Login</h2>
      <form
        class="form-signin"
        v-on:submit="handleSubmit"
      >
        <input
          type="text"
          id="username"
          class="form-control mt-4"
          placeholder="Brukernavn"
          v-model="username"
          required
          autofocus
        >
        <input
          type="password"
          id="password"
          placeholder="Passord"
          v-model="password"
          class="form-control mt-1"
          required
        >
        <input
          class="btn btn-primary btn-block mt-2"
          type="submit"
          value="Logg inn"
        />
      </form>
      {{ this.message}}
    </div>
  </div>
</template>

<script>
import JishoDataService from '../services/JishoDataService'
import http from "../http-common";


export default {
  data () {
    return {
      username: "",
      password: "",
      message: ""
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      if (this.password.length > 0) {
        JishoDataService.login({
          username: this.username,
          password: this.password
        })
          .then(response => {
            localStorage.setItem('jwt', response.data.token)
            localStorage.setItem('user', response.data.user)    
            if (localStorage.getItem('jwt') != null) {
            http.defaults.headers['Authorization'] = response.data.token
              if (this.$route.params.nextUrl != null) {
                this.$router.push(this.$route.params.nextUrl)
              }
              else {
                  this.$router.push('oversikt')
                }
              } 
            })
          .catch(error => {
            this.message = "Feil brukernavn eller passord"
            console.log(error)
          });
      }
    }
  }
}
</script>