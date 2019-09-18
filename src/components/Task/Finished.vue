<template>
  <div>
    <div class="vh-100 task-list">
      <loading class="loading container" v-if="$store.getters.loading"></loading>
      <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
      <div class="content container" v-else>
        <section class="row header">
          <p class="col-6">{{filteredTasks.length}} Einträge</p>
          <button
            type="button"
            data-toggle="modal"
            data-target="#filterModal"
            class="btn text-tudu-blu col-6 text-right"
          >Filtern</button>
        </section>

        <task-list :tasks="filteredTasks"></task-list>

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
  </div>
</template>

<script>
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
  data() {
    return {
      loading: false,

      error: null,
      tasks: [],
      tasktypes: []
    };
  },
  computed: {
    filteredTasks() {
      return this.tasks.filter(task =>
        this.filteredTasktypes.includes(task.tasktype_id)
      );
    },
    filteredTasktypes() {
      return this.tasktypes.reduce(function(filtered, option) {
        if (option.show) {
          filtered.push(option.id);
        }
        return filtered;
      }, []);
    }
  },
  created() {
    this.readTasks();
    this.readTasktypeFilter();
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

    readTasks() {
      this.$store.commit("isLoading", true);
      this.error = null;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/tasks/finished"
        )
        .then(response => {
          this.tasks = response.data.tasks;
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
        });
    },
    readTasktypeFilter() {
      if (localStorage.getItem(this.$route.params.id)) {
        this.tasktypes = JSON.parse(
          localStorage.getItem(this.$route.params.id)
        );
      } else {
        this.fetchTasktypes();
      }
    },
    fetchTasktypes() {
      axios
        .get(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/tasktypes"
        )
        .then(response => {
          this.tasktypes = response.data.tasktypes;
          this.tasktypes.forEach(element => (element.show = true));
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>