<template>
  <div>
    <div class="vh-100">
      <div class="list-group">
        <section v-if="tasks.length > 0">
          <article v-for="(task, index) in tasks" class="list-group-item list-group-item-action">
            <h3>
              <font-awesome-icon :icon="['fas', 'tag']"></font-awesome-icon>
              {{ task.title }}
            </h3>
            <p>{{task.description}}</p>
            <p>{{task.priority}}</p>
            <p>{{task.tasktype_id}}</p>
            <p>{{task.roomtype_id}}</p>
            <button @click="initUpdate(index)" class="btn btn-success btn-xs" style="padding:8px">
              <span class="glyphicon glyphicon-edit"></span>
            </button>
            <button
              @click="showDeleteDialog(index)"
              data-toggle="modal"
              data-target="#deleteModal"
              class="btn btn-danger btn-xs"
              style="padding:8px"
            >
              <span class="glyphicon glyphicon-trash"></span>
            </button>
          </article>
        </section>
        <section class="lead" v-else>Es gibt noch keine Aufgaben 😢. Trage doch einfach deine
          <router-link
            :to="{name: 'tasks.new', params: { id: this.$route.params.id } }"
          >erste Aufgabe ein!</router-link>
        </section>
      </div>

      <router-link
        :to="{name: 'tasks.new', params: { id: this.$route.params.id } }"
        type="button"
        class="btn btn-plus"
      >
        <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
      </router-link>

      <!-- Modal -->
      <div
        class="modal fade"
        id="deleteModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-body">
              <p>Möchtest du "{{ delete_task.title}}" wirklich löschen?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
              <button @click="deleteTask()" type="button" class="btn btn-danger">Löschen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-body">
        <table class="table table-bordered table-striped table-responsive" v-if="tasks.length > 0">
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

      <!-- /.modal -->
      <div class="modal fade" tabindex="-1" role="dialog" id="update_task_model">
        <div class="modal-dialog" role="document">
          <update-task
            v-on:updatetask="readTasks"
            v-model="update_task"
            v-bind:thetask="update_task"
          ></update-task>
        </div>
        <!-- /.modal-dialog -->
      </div>
      <!-- /.modal -->
    </div>
  </div>
</template>



<script>
import UpdateTask from "./UpdateTask.vue";
export default {
  components: {
    UpdateTask
  },
  data() {
    return {
      delete_task: {
        title: "",
        description: ""
      },
      delete_index: "",

      errors: [],
      tasks: [],
      update_task: {}
    };
  },

  mounted() {
    this.readTasks();
    this.$store.commit("changePage", "Aufgaben");
  },

  methods: {
    showDeleteDialog(index) {
      this.delete_tasktype = this.tasktypes[index];
      this.delete_index = index;
      $("#deleteModal").modal("show");
    },
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

    readTasks() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          "http://localhost:8000/api/auth/group/" +
            this.$route.params.id +
            "/tasks"
        )
        .then(response => {
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