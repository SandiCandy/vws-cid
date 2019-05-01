<template>
  <div class="min-h-100 col-sm-12">
    <div v-if="success">
      <successful msg="Du wirst jetzt direkt zum Login weitergeleitet."></successful>
    </div>
    <div v-else>
      <h1>Registrierung</h1>
      <p>Hej, schön, dass du hier bist.</p>
      <form>
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
          <button type="button" @click="login" class="btn btn-block tudu-blu">Registrieren</button>
        </div>

        <div class="form-group">
          <p>
            <router-link to="/login">Du hast schon ein Konto? Hier kommst du direkt zur Anmeldung.</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>



<script>
import Successful from "../common/Successful.vue";
export default {
  components: {
    Successful
  },
  data() {
    return {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      attemptSubmit: false,
      success: false
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
        .post(process.env.ROOT_API + "/auth/signup", {
          name: this.username,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        })
        .then(response => {
          console.log(response.data);
          this.success = true;
          this.reset();
          setTimeout(this.redirect, 1500);
        })
        .catch(error => {
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
    },
    redirect() {
      this.$router.push("/login");
    }
  }
};
</script>