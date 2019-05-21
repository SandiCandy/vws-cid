<template>
  <div class="vh-100">
    <loading class="loading" v-if="$store.getters.loading"></loading>
    <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
    <div class="content card" v-else>
      <div class="card-body" v-if="task">
        <p>
          <strong>{{task.tasktype.name}}</strong>
        </p>
        <h3 class="card-title">{{task.title}}</h3>
        <div class="card-text">
          <p>
            <small class="text-muted">
              {{ moment(task.created_at).format('LL') }}
              <span
                v-if="task.creator"
              >von {{ task.creator.name}}</span>
              <span v-else>(automatisch erstellt)</span>
            </small>
          </p>
          <p>{{task.description}}</p>

          <p v-if="room && room.roomtype">
            <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="mr-3"></font-awesome-icon>
            {{room.roomtype.name }} / {{room.name}}
          </p>
        </div>
        <img
          :src="backend_url + '/storage/' + task.images[0].name"
          class="card-img-top"
          alt="..."
          v-if="task.images && task.images.length > 0"
        >
        <button data-toggle="modal" data-target="#deleteModal" class="btn text-danger pl-0">
          <font-awesome-icon :icon="['fas', 'trash']" class="mr-3"></font-awesome-icon>Aufgabe löschen
        </button>
      </div>
    </div>
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <delete-task-modal v-bind:task="task" v-on:taskDeleted="removeDeletedTask"></delete-task-modal>
    </div>
  </div>
</template>

<script>
import Loading from "../common/Loading.vue";
import DeleteTaskModal from "./TaskComponents/DeleteTaskModal.vue";
export default {
  components: { DeleteTaskModal, Loading },
  data() {
    return {
      //task: null,
      room: null,
      backend_url: process.env.ROOT,
      task: {}
    };
  },
  created() {
    this.fetchTask();
    this.$store.commit("changePage", "Detail");
  },
  methods: {
    fetchTask() {
      this.$store.commit("isLoading", true);
      this.$store.commit("hasError", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(process.env.ROOT_API + "/auth/tasks/" + this.$route.params.tid)
        .then(response => {
          this.task = response.data.task;
          this.room = response.data.room[0];
          console.log(response.data);
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
        });
    },
    removeDeletedTask() {
      this.$emit("deletemodal", this.index);
      history.back();
    }
  }
};
</script>
