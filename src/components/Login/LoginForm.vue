<template>
  <form class="modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="modal-title">Login</h4>
    </div>

    <div class="modal-body">
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

      <div class="form-group">
        <p>
          <router-link to="/signup">Jetzt kostenlos registrieren</router-link>
        </p>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" @click="reset" class="btn btn-default" data-dismiss="modal">Close</button>
      <button type="button" @click="login" class="btn btn-primary">Einloggen</button>
    </div>
  </form>
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

  methods: {
    login() {
      axios
        .post("http://localhost:8000/api/auth/login", {
          email: this.email,
          password: this.password,
          remember_me: this.remember_me
        })
        .then(response => {
          console.log(response.data.access_token);
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