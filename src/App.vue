<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <router-link to="/" class="navbar-brand">Juuhu-Tuudu</router-link>
            <button
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <navigation-left></navigation-left>
              <ul class="nav navbar-nav navbar-right" v-if="this.isLoggedIn">
                <li class="nav-item">
                  <button @click="onLogout" type="button" class="btn btn-link">Logout</button>
                </li>
              </ul>
              <ul class="nav navbar-nav navbar-right" v-else>
                <li class="nav-item">
                  <router-link to="/onLogin">Login</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/signup">Signup</router-link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      <img src="./assets/logo.png">
      <h1>{{ msg }}</h1>

      <div class="row">
        <div class="col-xs-12">
          <div id="view">
            <router-view v-on:onLogin="onLogin"></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationLeft from "./components/Navigation/NavigationLeft.vue";
export default {
  name: "app",
  components: {
    NavigationLeft
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      isLoggedIn: $cookies.isKey("token")
    };
  },
  methods: {
    onLogout() {
      $cookies.remove("token");
      this.isLoggedIn = false;
    },
    onLogin() {
      this.isLoggedIn = $cookies.isKey("token");
    }
  }
};
</script>

<style lang="scss">
#app {
  margin: 30px 0 0 0;
  background: #f7f8fb;
  min-height: 800px;
}
#view {
  margin-top: 80px;
}

.navbar li {
  padding: 2px 5px;
}
</style>
