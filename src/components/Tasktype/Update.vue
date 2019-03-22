<template>
  <div class="tudu-blu row vh-100">
    <div class="alert alert-danger" v-if="errors.length > 0">
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </div>

    <form class="col-sm-12">
      <div class="form-group">
        <label for="name">Name *</label>
        <input type="text" name="name" id="name" class="form-control" v-model="task.name">
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button type="button" @click="updateTask" class="btn btn-outline-light">Änderung speichern</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      task: null,
      errors: []
    };
  },
  mounted() {
    this.$store.commit("changePage", "Aufgabe ändern");
    this.fetchTask();
  },

  methods: {
    fetchTask() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get("http://localhost:8000/tasks/" + this.$route.params.ttid)
        .then(response => {
          this.task = response.data.task;
          console.log(response.data);
        })
        .catch(error => {
          console.log(error.data);
        });
    },
    updateTask() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .put(
          process.env.ROOT_API + "/auth/group/" +
            this.$route.params.id +
            "/tasks/" +
            this.$route.params.ttid +
            "/update",
          {
            name: this.task.name
          }
        )
        .then(response => {
          console.log(response);
          this.reset();
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
      this.task.name = "";
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