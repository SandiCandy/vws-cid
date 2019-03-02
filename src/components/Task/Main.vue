<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3>
              <span class="glyphicon glyphicon-dashboard"></span> Assignment Dashboard
            </h3>
            <br>
            <button
              @click="initAddTask()"
              class="btn btn-success"
              style="padding:5px"
            >Add New Assignment</button>
          </div>

          <div class="panel-body">
            <table
              class="table table-bordered table-striped table-responsive"
              v-if="tasks.length > 0"
            >
              <tbody>
                <tr>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Tasktype</th>
                  <th>Action</th>
                </tr>

                <tr v-for="(task, index) in tasks">
                  <td>{{ index + 1 }}</td>
                  <td>{{ task.title }}</td>
                  <td>{{ task.description }}</td>
                  <td>{{ task.tasktype}}</td>
                  <td>
                    <button
                      @click="initUpdate(index)"
                      class="btn btn-success btn-xs"
                      style="padding:8px"
                    >
                      <span class="glyphicon glyphicon-edit"></span>
                    </button>
                    <button
                      @click="deleteTask(index)"
                      class="btn btn-danger btn-xs"
                      style="padding:8px"
                    >
                      <span class="glyphicon glyphicon-trash"></span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" tabindex="-1" role="dialog" id="add_task_model">
      <div class="modal-dialog" role="document">
        <add-task v-on:newtask="readTasks"></add-task>
      </div>
      <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
    <div class="modal fade" tabindex="-1" role="dialog" id="update_task_model">
      <div class="modal-dialog" role="document">
        <update-task v-on:updatetask="readTasks" v-model="update_task" v-bind:thetask="update_task"></update-task>
      </div>
      <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
  </div>
</template>



<script>
import AddTask from "./AddTask.vue";
import UpdateTask from "./UpdateTask.vue";
export default {
  components: {
    AddTask,
    UpdateTask
  },
  data() {
    return {
      task: {
        title: "",
        description: "",
        tasktype: ""
      },

      errors: [],
      tasks: [],
      update_task: {}
    };
  },

  mounted() {
    this.readTasks();
  },

  methods: {
    deleteTask(index) {
      let conf = confirm("Do you ready want to delete this task?");

      if (conf === true) {
        axios
          .delete("http://localhost:8000/api/tasks/" + this.tasks[index].id)
          .then(response => {
            this.tasks.splice(index, 1);
          })
          .catch(error => {});
      }
    },

    initAddTask() {
      $("#add_task_model").modal("show");
    },
    readTasks() {
      axios.get("http://localhost:8000/api/tasks").then(response => {
        this.tasks = response.data.tasks;
      });
    },
    initUpdate(index) {
      this.update_task = this.tasks[index];
      this.errors = [];
      $("#update_task_model").modal("show");
    }
  }
};
</script>