<template>
  <div class="vh-100 bg-white pt-1">
    <loading class="loading col-sm-12" v-if="$store.getters.loading"></loading>
    <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
    <div class="content container" v-else>
      <form class="col-sm-12">
        <div class="form-group">
          <label for="title">Name *</label>
          <input
            type="text"
            name="title"
            id="title"
            class="form-control"
            v-model="task.title"
            v-bind:class="{ 'is-invalid': attemptSubmit && requiredTitle }"
          >
          <div class="invalid-feedback">Bitte gib eine Aufgabenbezeichnung an.</div>
        </div>

        <div class="form-group">
          <label for="description">Beschreibung</label>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="5"
            class="form-control"
            v-model="task.description"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="tasktype_id">Aufgabenart *</label>
          <select
            v-model="task.tasktype_id"
            class="form-control"
            name="tasktype_id"
            id="tasktype_id"
            v-bind:class="{ 'is-invalid': attemptSubmit && requiredTasktype }"
          >
            <option v-for="(ttype, index) in tasktypes" :value="ttype.id">{{ ttype.name }}</option>
          </select>
          <div class="invalid-feedback">Bitte gib einen Aufgabentypen an.</div>
        </div>

        <div class="form-group">
          <label for="priority">Priorität *</label>
          <select v-model="task.priority" class="form-control" name="priority" id="priority">
            <option value="0">Niedrig</option>
            <option value="5">Normal</option>
            <option value="10">Hoch</option>
          </select>
        </div>

        <div class="form-group">
          <label for="roomtype_id">Bereich</label>
          <select v-model="roomtype_id" class="form-control" name="roomtype_id" id="roomtype_id">
            <option value="0"></option>
            <option
              v-for="(rtype, index) in roomtypes"
              :value="rtype.id"
            >{{ rtype.name }} ({{ rtype.rooms_count}} Orte)</option>
          </select>
        </div>

        <div class="form-group" v-if="roomtype_id > 0 || task.room_id">
          <label for="room_id">Ort</label>
          <select v-model="task.room_id" class="form-control" name="room_id" id="room_id">
            <option v-for="(room, index) in rooms" :value="room.id">{{ room.name }}</option>
          </select>
        </div>

        <div
          class="form-group"
          v-if="task.images && task.images.length > 0"
        >Bildupload nicht verfügbar.</div>
        <div class="form-group" v-else>
          <label for="title">Foto</label>
          <input
            v-on:change="handleFileUpload"
            type="file"
            name="file"
            id="file"
            class="form-control"
            ref="file"
            accept="image/*"
            v-bind:class="{ 'is-invalid': attemptSubmit && fileTooLarge }"
          >
          <div class="invalid-feedback">Deine Datei ist leider zu groß.</div>
        </div>

        <div class="form-group" v-if="task.editor_id">
          <input type="checkbox" id="is_done" name="is_done" v-model="task.is_done">
          <label for="checkbox">Aufgabe erledigt</label>
        </div>

        <div class="form-group">
          <button type="button" @click="reset" class="btn btn-link text-tudu-blu pl-0">Abbrechen</button>
          <button type="button" @click="updateTask" class="btn tudu-blu">Änderung speichern</button>
        </div>
      </form>
      <div class="img-wrap" v-if="task.images && task.images.length > 0">
        <span data-toggle="modal" data-target="#deleteImgModal" class="close">&times;</span>
        <img :src="backend_url + '/storage/' + task.images[0].name" width="400">
      </div>
      <hr>
      <button data-toggle="modal" data-target="#deleteModal" class="btn text-danger">
        <font-awesome-icon :icon="['fas', 'trash']" class="mr-3"></font-awesome-icon>Aufgabe löschen
      </button>
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

    <div
      class="modal fade"
      id="deleteImgModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <p>Möchtest du das Bild wirklich löschen?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
            <button
              v-on:click="removeImage(task.images[0].id)"
              type="button"
              class="btn btn-danger"
            >Löschen</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "../common/Loading.vue";
import DeleteTaskModal from "./TaskComponents/DeleteTaskModal.vue";
export default {
  components: {
    DeleteTaskModal,
    Loading
  },
  data() {
    return {
      success: false,
      errors: [],
      error: null,
      task: {},
      roomtype_id: -1,
      tasktypes: [],
      roomtypes: [],
      rooms: [],
      attemptSubmit: false,
      backend_url: process.env.ROOT
    };
  },
  computed: {
    requiredTitle() {
      return this.task.title === "";
    },
    requiredTasktype() {
      return this.task.tasktype_id === "";
    },
    fileTooLarge() {
      return this.task.file && this.task.file.size > 15000;
    }
  },
  watch: {
    roomtype_id: function(newId, oldId) {
      /* -1 --> initialisierung */

      if (oldId != -1) {
        this.task.room_id = "";
      }
      if (newId > 0) {
        this.fetchRooms(newId);
      }
    }
  },
  created() {
    this.$store.commit("changePage", "Aufgaben ändern");
    this.fetchTask();
    this.fetchTasktypes();
    this.fetchRoomtypes();
    //TODO: Handling von Rooms & Roomtypes
    //
  },

  methods: {
    updateTask() {
      this.validateInput();
      this.success = false;
      console.log(this.task.room_id);
      let formData = new FormData();
      formData.append("title", this.task.title);
      if (this.task.description) {
        formData.append("description", this.task.description);
      }
      formData.append("priority", this.task.priority);
      formData.append("tasktype_id", this.task.tasktype_id);
      if (this.task.room_id) {
        formData.append("room_id", this.task.room_id);
      }
      formData.append("file", this.task.file);
      formData.append("is_done", +this.task.is_done);
      console.log(formData.get("title"));
      console.log(formData.get("is_done"));
      axios
        .post(
          process.env.ROOT_API + "/auth/tasks/" + this.task.id + "/update",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        .then(response => {
          console.log(response.data);
          this.success = true;
          setTimeout(this.reset, 1000);
        })
        .catch(error => {
          console.log(error.response);
          this.errors = [];

          if (error.response.data.errors.title) {
            this.errors.push(error.response.data.errors.title[0]);
          }

          if (error.response.data.errors.priority) {
            this.errors.push(error.response.data.errors.priority[0]);
          }

          if (error.response.data.errors.tasktype_id) {
            this.errors.push(error.response.data.errors.tasktype_id[0]);
          }
        });
    },
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
    reset() {
      this.task.title = "";
      this.task.description = "";
      this.task.tasktype_id = "";
      history.back();
    },
    fetchTasktypes() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/tasktypes"
        )
        .then(response => {
          console.log(response.data);
          this.tasktypes = response.data.tasktypes;
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    fetchRoomtypes() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/roomtypes"
        )
        .then(response => {
          console.log(response.data);
          this.roomtypes = response.data.roomtypes;
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    fetchRooms(id) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get(process.env.ROOT_API + "/auth/roomtype/" + id + "/rooms")
        .then(response => {
          this.rooms = response.data.rooms;
          console.log(response.data);
        })
        .catch(error => {
          console.log(error.data);
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
    handleFileUpload() {
      console.log(this.$refs);
      this.task.file = this.$refs.file.files[0];
    },
    validateInput() {
      this.attemptSubmit = true;
      this.errors = [];
      if (this.requiredTitle || this.requiredTasktype || this.fileTooLarge)
        event.preventDefault();
    },
    removeDeletedTask() {
      this.$emit("deletemodal", this.index);
      history.back();
    },
    removeImage(iid) {
      axios
        .delete(
          process.env.ROOT_API +
            "/auth/tasks/" +
            this.task.id +
            "/images/" +
            iid
        )
        .then(response => {
          $("#deleteImgModal").modal("hide");
          console.log("remove image");
          window.location.reload();
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>
<style scoped>
.img-wrap {
  position: relative;
  display: inline-block;
}
.img-wrap .close {
  position: absolute;
  top: -16px;
  right: -18px;
  z-index: 100;
  background-color: #3dbdbd;
  color: #ffffff;
  cursor: pointer;
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 50px;
  line-height: 28px;
  border-radius: 50%;
  opacity: 1;
}
.img-wrap:hover .close {
  background-color: red;
}
</style>
