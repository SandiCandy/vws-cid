<template>
  <div class="modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="modal-title">Add New Task</h4>
    </div>

    <div class="modal-body">
      <div class="alert alert-danger" v-if="errors.length > 0">
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </div>

      <div class="form-group">
        <label for="titles">Name:</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Task Title"
          class="form-control"
          v-model="task.title"
        >
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea
          name="description"
          id="description"
          cols="30"
          rows="5"
          class="form-control"
          placeholder="Task Description"
          v-model="task.description"
        ></textarea>
      </div>
    </div>

    <div class="form-group">
      <label for="tasktype">Type:</label>
      <input
        type="text"
        name="tasktype"
        id="tasktype"
        placeholder="Task Title"
        class="form-control"
        v-model="task.tasktype"
      >
    </div>

    <div class="modal-footer">
      <button type="button" @click="reset" class="btn btn-default" data-dismiss="modal">Close</button>
      <button type="button" @click="createTask" class="btn btn-primary">Submit</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      task: {
        title: "",
        description: "",
        tasktype: ""
      },
      errors: []
    };
  },

  methods: {
    createTask() {
      axios
        .post("http://localhost:8000/api/tasks", {
          title: this.task.title,
          description: this.task.description,
          tasktype: this.task.tasktype
        })
        .then(response => {
          this.$emit("newtask");
          this.reset();

          $("#add_task_model").modal("hide");
        })
        .catch(error => {
          this.errors = [];

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
      this.task.tasktype = "";
    }
  }
};
</script>