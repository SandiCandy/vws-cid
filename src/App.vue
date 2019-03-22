<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark tudu-blu">
      <a @click="$router.go(-1)">
        <font-awesome-icon :icon="['fas', 'chevron-left']"></font-awesome-icon>
      </a>
      <router-link to="/" class="navbar-brand">{{ $store.getters.pagetitle }}</router-link>
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
            <router-link to="/login">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/signup">Signup</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div id="view">
      <router-view v-on:onLogin="onLogin"></router-view>
    </div>
  </div>
</template>

<script>
import NavigationLeft from "./components/Navigation/NavigationLeft.vue";
var moment = require("moment");
export default {
  name: "app",
  components: {
    NavigationLeft
  },
  data() {
    return {
      moment: moment,
      isLoggedIn: $cookies.isKey("token")
    };
  },
  methods: {
    onLogout() {
      $cookies.remove("token");
      this.isLoggedIn = false;
    },
    onLogin() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + this.$cookies.get("token");
      this.isLoggedIn = $cookies.isKey("token");
    }
  }
};
</script>

<style lang="scss">
#app {
  margin: 0;
  background: #f7f8fb;
  // min-height: 800px;
}

html a,
.text-tudu-blu {
  color: #39d8d8;
}

.navbar a {
  color: #ffffff;
}

.navbar.tudu-blu,
.btn.tudu-blu,
div.tudu-blu {
  background-color: #39d8d8;
  color: #ffffff;
}

[type="button"].btn {
  -webkit-appearance: inherit;
}

.btn.tudu-blu-outline {
  background-color: #ffffff;
  border: 2px solid #39d8d8;
  color: #39d8d8;
}

.btn.tudu-blu-outline-invers {
  border: 2px solid #ffffff;
  & a {
    color: #ffffff;
  }
}

.navbar li {
  padding: 2px 5px;
}

section h1 {
  font-size: 16px;
  font-weight: initial;
  color: #39d8d8;
}

.btn.btn-plus {
  position: fixed;
  bottom: 20vh;
  right: 5vw;
  height: 60px;
  width: 60px;
  font-size: 29px;
  background-color: #39d8d8;
  border-radius: 50%;
  box-shadow: 2px 2px 4px #afafaf;
  color: #ffffff;
  z-index: 100;
}

.loading,
.success {
  padding-top: 30vh;
}
.success .display-5 {
  padding-top: 1rem;
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 1.2;
}

.media .media-body a,
.list-group-item a {
  color: #707070;
}
</style>
