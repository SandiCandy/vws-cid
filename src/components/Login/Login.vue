<template>
  <div class="min-h-100 col-sm-12">
    <loading class="loading container" v-if="$store.getters.loading"></loading>
    <div v-else-if="success">
      <successful msg="Erfolgreich."></successful>
    </div>
    <div v-else>
      <h1>Login</h1>
      <p>Willkommen zurück!</p>
      <form>
        <div class="alert alert-danger" v-if="errors.length > 0">
          <p>Benutzername oder Passwort nicht korrekt!</p>
        </div>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            type="email"
            name="email"
            id="email"
            class="form-control"
            v-model="email"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password">Passwort</label>
          <input
            type="password"
            name="password"
            id="password"
            class="form-control"
            v-model="password"
            autocomplete="current-password"
            v-on:keyup.enter="login"
          />
        </div>

        <div class="form-group form-check">
          <input type="checkbox" class="form-check-input" id="remember_me" v-model="remember_me" />
          <label class="form-check-label" for="remember_me">Eingeloggt bleiben</label>
        </div>

        <div class="form-group">
          <button type="button" @click="login" class="btn tudu-blu btn-block">Einloggen</button>
        </div>

        <div class="form-group">
          <p>
            <router-link to="/signup">Noch kein Konto? Jetzt kostenlos registrieren.</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>



<script>
import Successful from "../common/Successful.vue";
import Loading from "../common/Loading.vue";
export default {
  components: {
    Successful,
    Loading
  },
  data() {
    return {
      email: "",
      password: "",
      remember_me: true,
      errors: [],
      success: false
    };
  },

  mounted() {
    this.$store.commit("isLoading", false);
  },

  methods: {
    callEvent() {
      alert("Enter!");
    },
    login() {
      this.$store.commit("isLoading", true);
      axios
        .post(process.env.ROOT_API + "/auth/login", {
          email: this.email,
          password: this.password,
          remember_me: this.remember_me
        })
        .then(response => {
          this.auth(this.email, response.data.access_token);
          this.reset();
          this.success = true;
          setTimeout(this.redirect, 1000);
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          this.errors = [];
          this.errors.push(error.response.data.message);
          console.log(error.reponse);
          this.$store.commit("isLoading", false);
        });
    },
    reset() {
      this.email = "";
      this.password = "";
    },
    auth(user, token) {
      this.$cookies.set("token", token, "7d");
      this.$emit("login");
    },
    redirect() {
      this.$router.push({ name: "dashboard" });
    }
  }
};
</script>