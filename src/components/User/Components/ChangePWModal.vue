<template>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <form class="modal-body">
        <h1>Zur Zeit ist die Änderung des Passworts nicht möglich.</h1>
        <input
          type="hidden"
          id="username"
          name="username"
          class="form-control"
          autocomplete="username"
          :value="setting"
        >
        <div class="form-group">
          <label for="pw_old">Aktuelles Passwort</label>
          <input
            type="password"
            name="pw_old"
            id="pw_old"
            class="form-control"
            autocomplete="current-password"
            v-model="pw_old"
            readonly
          >
        </div>

        <div class="form-group">
          <label for="password">Neues Passwort</label>
          <input
            type="password"
            name="password"
            id="password"
            class="form-control"
            autocomplete="new-password"
            v-model="password"
            readonly
          >
        </div>

        <div class="form-group">
          <label for="password_confirmation">Passwort wiederholen</label>
          <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            class="form-control"
            v-model="password_confirmation"
            autocomplete="new-password"
            v-bind:class="{ 'is-invalid': attemptSubmit && confirmationFailed }"
            readonly
          >
          <div class="invalid-feedback">Passwörter stimmen nicht überein.</div>
        </div>
      </form>
      <div class="modal-footer">
        <button @click="reset()" type="button" class="btn text-secondary" data-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pw_old: "",
      password: "",
      password_confirmation: "",
      attemptSubmit: false,
      success: false
    };
  },
  props: ["setting"],
  computed: {
    shortPassword() {
      return this.password.length < 6;
    },
    confirmationFailed() {
      return this.password !== this.password_confirmation;
    }
  },
  methods: {
    changeName() {
      validateInput();
      //TODOOO Ajax-request
    },
    reset() {
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
    }
  }
};
</script>