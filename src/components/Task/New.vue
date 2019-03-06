<template>
  <div class="tudu-blu row vh-100">
    <div class="alert alert-danger" v-if="errors.length > 0">
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </div>

    <form class="col-sm-12">
      <div class="form-group">
        <label for="title">Name *</label>
        <input type="text" name="title" id="title" class="form-control" v-model="task.title">
      </div>

      <div class="form-group">
        <label for="description">Beschreibung</label>
        <textarea
          name="description"
          id="description"
          cols="30"
          rows="5"
          class="form-control"
          v-model="task.description"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="tasktype">Aufgabenart *</label>
        <select v-model="task.tasktype_id" class="form-control" id="tasktype_id">
          <option v-for="(ttype, index) in tasktypes" v-model="ttype.id">{{ ttype.name }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="priority">Priorität *</label>
        <select v-model="task.priority" class="form-control" id="priority">
          <option value="0">Niedrig</option>
          <option value="5">Normal</option>
          <option value="10">Hoch</option>
        </select>
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button type="button" @click="createTask" class="btn btn-outline-light">Aufgabe erstellen</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      task: {
        title: "",
        description: "",
        tasktype: "",
        priority: 5,
        roomtype: "",
        roomname: ""
      },
      tasktypes: [],
      errors: []
    };
  },

  mounted() {
    this.$store.commit("changePage", "Neue Aufgabe");
    this.getTasktypes();
  },

  methods: {
    createTask() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .post(
          "http://localhost:8000/api/auth/group/" +
            this.$route.params.id +
            "/task/create",
          {
            title: this.task.title,
            description: this.task.description,
            tasktype: this.task.tasktype
          }
        )
        .then(response => {
          this.$emit("newtask");
          this.reset();
        })
        .catch(error => {
          this.errors = [];
          console.log(error.response);

          if (error.response.data.errors && error.response.data.errors.title) {
            this.errors.push(error.response.data.errors.title[0]);
          }
          if (
            error.response.data.errors &&
            error.response.data.errors.description
          ) {
            this.errors.push(error.response.data.errors.description[0]);
          }

          if (
            error.response.data.errors &&
            error.response.data.errors.tasktype
          ) {
            this.errors.push(error.response.data.errors.tasktype[0]);
          }
        });
    },
    reset() {
      this.task.title = "";
      this.task.description = "";
      this.task.tasktype_id = "";
      this.task.priority = 5;
      this.task.roomtype = "";
      this.task.roomname = "";
      history.back();
    },
    getTasktypes() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          "http://localhost:8000/api/auth/group/" +
            this.$route.params.id +
            "/tasktypes"
        )
        .then(response => {
          console.log(response.data);
          this.tasktypes = response.data.tasktypes;
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>

<style lang="scss">
.tudu-blu label {
  margin-bottom: 0;
  font-size: 0.9rem;
}
</style>