<template>
  <div class="tudu-blu row vh-100">
    <div v-if="success">
      <successful msg="Aufgabentyp erfolgreich angelegt."></successful>
    </div>
    <div class="alert alert-danger" v-if="errors.length > 0">
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </div>

    <form class="col-sm-12">
      <div class="form-group">
        <label for="name">Name *</label>
        <input type="text" name="name" id="name" class="form-control" v-model="tasktype.name">
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button
          type="button"
          @click="createTasktype"
          class="btn btn-outline-light"
        >Aufgabenart erstellen</button>
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
      tasktype: {
        name: ""
      },
      errors: [],
      success: false
    };
  },
  mounted() {
    this.$store.commit("changePage", "Neue Aufgabenart");
  },

  methods: {
    createTasktype() {
      this.success = false;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .post(
          "http://localhost:8000/api/auth/group/" +
            this.$route.params.id +
            "/tasktype/create",
          {
            name: this.tasktype.name
          }
        )
        .then(response => {
          this.$emit("newtasktype");
          console.log(response.data);
          this.success = true;
          setTimeout(this.reset, 1000);
        })
        .catch(error => {
          this.errors = [];
          console.log(error.response);

          if (error.response.data.errors && error.response.data.errors.name) {
            this.errors.push(error.response.data.errors.name[0]);
          }
        });
    },
    reset() {
      this.tasktype.name = "";
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
.full-width {
  margin-left: -15px;
}
</style>