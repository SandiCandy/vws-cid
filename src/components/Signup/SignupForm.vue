<template>
  <form class="modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="modal-title">Registrierung</h4>
    </div>

    <div class="modal-body">
      <div class="alert alert-danger" v-if="errors.length > 0">
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </div>

      <div class="form-group">
        <label for="username">Name</label>
        <input
          type="text"
          name="username"
          id="username"
          class="form-control"
          v-model="username"
          autocomplete="name"
          v-bind:class="{ 'is-invalid': attemptSubmit && missingName }"
        >
        <div class="invalid-feedback">Name fehlt.</div>
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
          v-bind:class="{ 'is-invalid': attemptSubmit && !validEmail }"
        >
        <div class="invalid-feedback">E-Mail-Adresse ist ungültig.</div>
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
          v-bind:class="{ 'is-invalid': attemptSubmit && shortPassword }"
        >
        <div class="invalid-feedback">Das Passwort muss mindestens 6 Zeichen haben.</div>
      </div>

      <div class="form-group">
        <label for="password_confirmation">Passwort wiederholen</label>
        <input
          type="password"
          name="password_confirmation"
          id="password_confirmation"
          class="form-control"
          v-model="password_confirmation"
          autocomplete="current-password"
          v-bind:class="{ 'is-invalid': attemptSubmit && confirmationFailed }"
        >
        <div class="invalid-feedback">Passwörter stimmen nicht überein.</div>
      </div>

      <div class="form-group">
        <p>
          <router-link to="/login">Direkt zur Anmeldung</router-link>
        </p>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" @click="reset" class="btn btn-default" data-dismiss="modal">Close</button>
      <button type="button" @click="login" class="btn btn-primary">Registrieren</button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      attemptSubmit: false,
      errors: []
    };
  },
  computed: {
    validEmail() {
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        this.email
      );
    },
    missingName() {
      return this.username === "";
    },
    shortPassword() {
      return this.password.length < 6;
    },
    confirmationFailed() {
      return this.password !== this.password_confirmation;
    }
  },

  methods: {
    login() {
      this.validateInput();
      axios
        .post("http://localhost:8000/api/auth/signup", {
          name: this.username,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        })
        .then(response => {
          console.log(response.data);
          this.reset();
          this.$router.push("/login");
        })
        .catch(error => {
          this.errors = [];
          console.log(error, error.response);
        });
    },
    reset() {
      this.username = "";
      this.email = "";
      this.password = "";
      this.password_confirmation = "";
      this.attemptSubmit = false;
    },
    validateInput() {
      this.attemptSubmit = true;
      this.errors = [];
      if (
        !this.validEmail ||
        this.missingName ||
        this.shortPassword ||
        this.confirmationFailed
      )
        event.preventDefault();
      // if (
      //   !this.username ||
      //   !this.email ||
      //   !this.password ||
      //   !this.password_confirmation
      // ) {
      //   this.errors.push("Name erforderlich");
      // }
    }
  }
};
</script>