<template>
  <div class="tudu-blu row vh-100">
    <div v-if="success">
      <successful :msg="msg"></successful>
    </div>
    <div class="alert alert-danger" v-if="errors.length > 0">
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </div>

    <form class="col-sm-12">
      <div class="form-group">
        <label for="email">E-mail *</label>
        <input type="email" name="email" id="email" class="form-control" v-model="member.email">
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button type="button" @click="createTask" class="btn btn-outline-light">Einladen</button>
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
      member: {
        name: "",
        role: "Admin"
      },
      errors: [],
      msg: ""
    };
  },

  created() {
    this.$store.commit("changePage", "Neues Teammitglied");
  },

  methods: {
    createTask() {
      this.success = false;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .post(
          "http://localhost:8000/api/auth/group/" +
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