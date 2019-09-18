<template>
  <div class="task-list">
    <loading class="loading container" v-if="$store.getters.loading"></loading>
    <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
    <div class="content container" v-else>
      <section class="row header">
        <p class="col-6">{{filteredCurrentTasks.length + filteredFutureTasks.length}} Einträge</p>
        <button
          type="button"
          data-toggle="modal"
          data-target="#filterModal"
          class="btn text-tudu-blu col-6 text-right"
        >Filtern</button>
      </section>

      <task-list title="Aktuelle Aufgaben" :tasks="filteredCurrentTasks"></task-list>

      <task-list title="Zukünftige Aufgaben123" :tasks="filteredFutureTasks"></task-list>

      <add-task-button></add-task-button>

      <div
        class="modal fade"
        id="filterModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="filterModalLabel"
        aria-hidden="true"
      >
        <filter-task-modal :tasktypes="tasktypes" v-on:setFilter="readTasktypeFilter"></filter-task-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { tasktypeFilterMixin } from "../../mixins/tasktypeFilterMixin";
import Loading from "../common/Loading.vue";
import TaskList from "./TaskComponents/TaskList.vue";
import AddTaskButton from "./TaskComponents/AddTaskButton.vue";
import FilterTaskModal from "./TaskComponents/FilterTaskModal.vue";
export default {
  components: {
    Loading,
    TaskList,
    AddTaskButton,
    FilterTaskModal
  },
  mixins: [tasktypeFilterMixin],
  data() {
    return {
      error: null,
      allCurrentTasks: [],
      allFutureTasks: []
    };
  },
  computed: {
    filteredCurrentTasks() {
      return this.allCurrentTasks.filter(task =>
        this.filteredTasktypes.includes(task.tasktype_id)
      );
    },
    filteredFutureTasks() {
      return this.allFutureTasks.filter(task =>
        this.filteredTasktypes.includes(task.tasktype_id)
      );
    }
  },

  created() {
    this.fetchCurrentTasks();
    this.fetchFutureTasks();
    this.$store.commit("changePage", "Aufgaben");
  },

  methods: {
    fetchCurrentTasks() {
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
          this.allCurrentTasks = response.data.tasks;
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
        });
    },

    fetchFutureTasks() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/tasks/future"
        )
        .then(response => {
          this.allFutureTasks = response.data.tasks;
          this.readTasktypeFilter();
        })
        .catch(error => {
          console.warn("Error with future tasks", error.toString());
        });
    }
  }
};
</script>

<style scoped>
@import "../../styles/taskOverview.css";
</style>