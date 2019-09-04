<template>
  <div class="vh-100 bg-white pt-1">
    <div class="arrow-right" :class="'prio-' + task.priority"></div>
    <loading class="loading col-sm-12" v-if="$store.getters.loading"></loading>
    <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
    <div class="content container" v-else>
      <update-form v-bind:task="task" v-bind:roomtype_id="roomtype_id"></update-form>
      <image-component
        v-bind:image="task.images[0]"
        v-bind:tid="task.id"
        v-if="task.images && task.images.length > 0"
      ></image-component>
      <hr />
      <button data-toggle="modal" data-target="#deleteModal" class="btn text-danger">
        <font-awesome-icon :icon="['fas', 'trash']" class="mr-3"></font-awesome-icon>Aufgabe löschen
      </button>
      <p
        class="text-right"
        v-if="task.creator"
      >Erstellt am {{ moment(task.created_at).format('LL') }}&nbsp;von {{ task.creator.name}}.</p>
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
import ImageComponent from "./TaskComponents/ImageComponent.vue";
import UpdateForm from "./TaskComponents/UpdateForm.vue";
export default {
  components: {
    DeleteTaskModal,
    ImageComponent,
    Loading,
    UpdateForm
  },
  data() {
    return {
      error: null,
      task: {},
      roomtype_id: -1
    };
  },
  created() {
    this.$store.commit("changePage", "Aufgaben ändern");
    this.fetchTask();
  },

  methods: {
    fetchTask() {
      this.$store.commit("isLoading", true);
      this.error = null;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get(process.env.ROOT_API + "/auth/tasks/" + this.$route.params.tid)
        .then(response => {
          this.task = response.data.task;
          console.log(response.data);
          if (this.task.room_id) {
            this.getRoomtype(this.task.room_id);
          }
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          console.log(error.data);
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
        });
    },
    getRoomtype(room_id) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get(process.env.ROOT_API + "/auth/room/" + room_id + "/roomtype")
        .then(response => {
          this.roomtype_id = response.data.roomtype.id;
          console.log(response.data);
        })
        .catch(error => {
          console.log(error.data);
        });
    },
    removeDeletedTask() {
      this.$emit("deletemodal", this.index);
      history.back();
    }
  }
};
</script>

<style lang="scss" scoped>
.arrow-right {
  background-color: transparent;
  height: 70px;
  left: -35px;
  position: absolute;
  top: -35px;
  width: 70px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  z-index: 5;

  &.prio-0 {
    background-color: $green;
  }

  &.prio-5 {
    background-color: $yellow;
  }

  &.prio-10 {
    background-color: $red;
  }
}

div.vh-100 {
  position: relative;
}
</style>