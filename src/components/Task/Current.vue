<template>
  <div>
    <div class="vh-100">
      <loading class="loading" v-if="$store.getters.loading"></loading>
      <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
      <div class="content" v-else>
        <div class="list-group">
          <section v-if="tasks.length > 0">
            <article v-for="(task, index) in tasks" class="list-group-item list-group-item-action">
              <p>{{ moment(task.created_at).format('LL') }} von {{ task.creator.name}}</p>
              <h3>
                <font-awesome-icon :icon="['fas', 'hammer']"></font-awesome-icon>
                {{ task.title }}
              </h3>
              <p>{{task.description}}</p>
              <p>{{task.priority}}</p>
              <button @click="isDone(index)" type="button">
                <font-awesome-icon :icon="['fas', 'check']" class="display-4"></font-awesome-icon>
              </button>
              <router-link
                class="btn btn-success btn-xs"
                style="padding:8px"
                :to="{name: 'tasks.update', params: { id: $route.params.id, tid: task.id } }"
              >
                <span class="glyphicon glyphicon-edit"></span>
              </router-link>
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
          <div v-else>
            <no-tasks></no-tasks>
          </div>
        </div>

        <add-task-button></add-task-button>

        <div
          class="modal fade"
          id="deleteModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-hidden="true"
        >
          <delete-task-modal v-bind:task="delete_task" v-on:taskDeleted="removeDeletedTask"></delete-task-modal>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import Loading from "../common/Loading.vue";
import NoTasks from "./TaskComponents/NoTasks.vue";
import AddTaskButton from "./TaskComponents/AddTaskButton.vue";
import DeleteTaskModal from "./TaskComponents/DeleteTaskModal.vue";
export default {
  components: {
    Loading,
    NoTasks,
    AddTaskButton,
    DeleteTaskModal
  },
  data() {
    return {
      error: null,
      delete_task: {},
      delete_index: "",
      errors: [],
      tasks: []
    };
  },

  created() {
    this.fetchTasks();
    this.$store.commit("changePage", "Aufgaben");
  },

  methods: {
    isDone(index) {
      axios
        .patch(
          "http://localhost:8000/api/auth/tasks/" +
            this.tasks[index].id +
            "/finished"
        )
        .then(response => {
          this.tasks.splice(this.index, 1);
          console.log("Task finished");
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    showDeleteDialog(index) {
      this.delete_task = this.tasks[index];
      this.delete_index = index;
      $("#deleteModal").modal("show");
    },
    removeDeletedTask(index) {
      console.log("remove");
      this.tasks.splice(this.delete_index, 1);
    },

    fetchTasks() {
      this.$store.commit("isLoading", true);
      this.error = null;

      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          "http://localhost:8000/api/auth/group/" +
            this.$route.params.id +
            "/tasks/current"
        )
        .then(response => {
          this.tasks = response.data.tasks;
          console.log(response.data);
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
        });
    }
  }
};
</script>