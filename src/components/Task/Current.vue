<template>
  <div>
    <div class="task-list">
      <loading class="loading container" v-if="$store.getters.loading"></loading>
      <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
      <div class="content container" v-else>
        <section class="row header">
          <p class="col-6">{{filtered_tasks.length + " Einträge"}}</p>
          <button
            type="button"
            data-toggle="modal"
            data-target="#filterModal"
            class="btn text-tudu-blu col-6 text-right"
          >Filtern</button>
        </section>

        <section v-if="filtered_tasks.length > 0" class="main-sec">
          <article v-for="(task, index) in filtered_tasks" :key="task.id">
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

        <div
          class="modal fade"
          id="filterModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="filterModalLabel"
          aria-hidden="true"
        >
          <filter-task-modal v-on:setFilter="showFilteredTasks"></filter-task-modal>
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
import FilterTaskModal from "./TaskComponents/FilterTaskModal.vue";
export default {
  components: {
    Loading,
    TaskItem,
    NoTasks,
    AddTaskButton,
    DeleteTaskModal,
    FilterTaskModal
  },
  data() {
    return {
      error: null,
      delete_task: {},
      delete_index: "",
      errors: [],
      all_tasks: [],
      filtered_tasks: []
    };
  },

  created() {
    this.fetchTasks();
    this.$store.commit("changePage", "Aufgaben");
  },

  methods: {
    spliceArray(index) {
      this.filtered_tasks.splice(index, 1);
    },
    fetchTask(index) {
      this.delete_task = this.filtered_tasks[index];
      this.delete_index = index;
      $("#deleteModal").modal("show");
    },
    removeDeletedTask(index) {
      console.log("remove");
      this.filtered_tasks.splice(this.delete_index, 1);
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
          this.all_tasks = response.data.tasks;
          //Filter anwenden, falls vorhanden
          this.showFilteredTasks();
          console.log(response.data);
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
        });
    },
    showFilteredTasks() {
      this.filtered_tasks = [];
      if (localStorage.getItem(this.$route.params.id)) {
        let tasktypes = JSON.parse(localStorage.getItem(this.$route.params.id));
        let filtered_tasktype_ids = [];
        tasktypes.forEach(function(el) {
          if (el.show === false) {
            filtered_tasktype_ids.push(el.id);
          }
        });

        for (let i = 0; i < this.all_tasks.length; ++i) {
          this.filtered_tasks.push(this.all_tasks[i]);
          for (let j = 0; j < filtered_tasktype_ids.length; ++j) {
            if (this.all_tasks[i].tasktype_id === filtered_tasktype_ids[j]) {
              this.filtered_tasks.pop();
              break;
            }
          }
        }
      } else {
        this.filtered_tasks = this.all_tasks;
      }

      console.log("filtered", this.filtered_tasks.length);
    }
  }
};
</script>

<style lang="scss" scoped>
.header p,
.header button.btn {
  padding: 5px 5px 0 5px;
  line-height: 1.5;
  vertical-align: 0;
  margin: 0;
}
.header p {
  color: #777;
}
</style>



