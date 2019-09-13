<template>
  <div class="tudu-blu min-h-100">
    <div v-if="success">
      <successful :msg="msg"></successful>
    </div>

    <form class="col-sm-12">
      <div class="form-group">
        <label for="email">E-mail *</label>
        <input
          type="email"
          name="email"
          id="email"
          class="form-control"
          v-model="member.email"
          v-bind:class="{ 'is-invalid': attemptSubmit && invalidEmail }"
        />
        <div class="invalid-feedback">Bitte gebe eine gültige E-Mailadresse an.</div>
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button type="button" @click="createMember" class="btn btn-outline-light">Einladen</button>
      </div>
    </form>
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
      success: false,
      attemptSubmit: false,
      member: {
        name: "",
        role: "Admin",
        email: ""
      },
      errors: [],
      msg: ""
    };
  },
  computed: {
    invalidEmail() {
      return this.member.email === "";
    }
  },

  created() {
    this.$store.commit("changePage", "Neues Teammitglied");
  },

  methods: {
    createMember() {
      if (this.invalidInput()) {
        return true;
      }
      this.success = false;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .post(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/team/create",
          {
            email: this.member.email,
            role: this.member.role
          }
        )
        .then(response => {
          console.log(response.data);
          this.success = true;
          this.msg = response.data.message;
          setTimeout(this.reset, 1000);
        })
        .catch(error => {
          this.errors = [];
          console.log(error.response);

          if (error.response.data.errors && error.response.data.errors.email) {
            this.errors.push(error.response.data.errors.email[0]);
          }
        });
    },
    reset() {
      this.member.email = "";
      this.member.role = "Admin";
      history.back();
    },
    invalidInput() {
      this.attemptSubmit = true;
      this.errors = [];
      if (this.invalidEmail) return true;
    }
  }
};
</script>

<style lang="scss">
.tudu-blu label {
  margin-bottom: 0;
  font-size: 0.9rem;
}

.success {
  z-index: 10;
  background-color: green;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}
</style>