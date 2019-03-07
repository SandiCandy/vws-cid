<template>
  <div>
    <div class="vh-100">
      <div class="loading d-flex justify-content-center" v-if="loading">
        <font-awesome-icon
          :icon="['fas', 'spinner']"
          class="display-4 d-flex justify-content-center fa-spin"
        ></font-awesome-icon>
      </div>
      <div class="content" v-else>
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
    </div>
  </div>
</template>



<script>
//import UpdateTask from "./Update.vue";
export default {
  components: {
    //UpdateTask
  },
  data() {
    return {
      loading: false,
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
      this.delete_task = this.tasks[index];
      this.delete_index = index;
      $("#deleteModal").modal("show");
    },
    deleteTask(index) {
      axios
        .delete(
          "http://localhost:8000/api/auth/tasks/" +
            this.tasks[this.delete_index].id
        )
        .then(response => {
          this.tasks.splice(this.delete_index, 1);
          $("#deleteModal").modal("hide");
        })
        .catch(error => {});
    },

    readTasks() {
      this.loading = true;
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
          console.log(response.data);
          this.loading = false;
        });
    }
  }
};
</script>