<template>
  <div id="app">
    <nav class="navbar fixed-top navbar-expand navbar-dark bg-dark">

      <div class="navbar-nav mr-auto mx-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/admin/oversikt">søk</router-link>
        </li>
        <li class="nav-item">
          <div
            href="#"
            class="navbar-text font-weight-bold text-white px-4"
          >jishoadmin</div>
        <li class="nav-item">
          <a
            href="#"
            class="nav-link"
            v-on:click="logout"
          > {{ isLoggedIn() }}
          </a>
        </li>
      </div>
    </nav>

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
import router from './router'

export default {
  name: 'app',
  methods: {
    logout () {
      console.log("logging out front")
      localStorage.clear();
      router.push("/admin/login")
    },
    isLoggedIn () {
      if (localStorage.getItem('jwt') != null) {
        return "logg ut"
      } else {return "logg inn"}
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding-top: 5px;
}
</style>
