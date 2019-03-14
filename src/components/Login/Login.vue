<template>
  <div class="vh-100 col-sm-12">
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
        >
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
        >
      </div>

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="remember_me" v-model="remember_me">
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
</template>



<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      remember_me: true,
      errors: []
    };
  },

  mounted() {},

  methods: {
    login() {
      axios
        .post("http://localhost:8000/api/auth/login", {
          email: this.email,
          password: this.password,
          remember_me: this.remember_me
        })
        .then(response => {
          this.auth(this.email, response.data.access_token);
          this.reset();

          $("#login_modal").modal("hide");
        })
        .catch(error => {
          this.errors = [];
          this.errors.push(error.response.data.message);
          console.log(error.data);
        });
    },
    reset() {
      this.email = "";
      this.password = "";
    },
    auth(user, token) {
      this.$cookies.set("token", token, "7d");
      this.$emit("login");
    }
  }
};
</script>