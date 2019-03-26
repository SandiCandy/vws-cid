<template>
  <div>
    <div class="task-list">
      <loading class="loading container" v-if="$store.getters.loading"></loading>
      <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
      <div class="content container" v-else>
        <section v-if="tasks.length > 0" class="main-sec">
          <article v-for="(task, index) in tasks" :key="task.id">
            <task-item
              :task="task"
              :index="index"
              v-on:done="spliceArray"
              v-on:deletemodal="fetchTask"
            ></task-item>
            <hr>
          </article>
        </section>
        <div v-else>
          <no-tasks></no-tasks>
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
import TaskItem from "./TaskComponents/TaskItem.vue";
import NoTasks from "./TaskComponents/NoTasks.vue";
import AddTaskButton from "./TaskComponents/AddTaskButton.vue";
import DeleteTaskModal from "./TaskComponents/DeleteTaskModal.vue";
export default {
  components: {
    Loading,
    TaskItem,
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
    spliceArray(index) {
      this.tasks.splice(index, 1);
    },
    fetchTask(index) {
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
          process.env.ROOT_API +
            "/auth/group/" +
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


