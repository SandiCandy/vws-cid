<template>
  <div class="tudu-blu row vh-100">
    <div v-if="success">
      <successful></successful>
    </div>
    <div class="alert alert-danger" v-if="errors.length > 0">
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </div>

    <form class="col-sm-12">
      <div class="form-group">
        <label for="title">Name *</label>
        <input type="text" name="title" id="title" class="form-control" v-model="task.title">
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
        <select v-model="task.tasktype_id" class="form-control" name="tasktype_id" id="tasktype_id">
          <option v-for="(ttype, index) in tasktypes" :value="ttype.id">{{ ttype.name }}</option>
        </select>
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
          <option value="-1"></option>

          <option
            v-for="(rtype, index) in roomtypes"
            :value="rtype.id"
          >{{ rtype.name }} ({{ rtype.rooms_count}} Orte)</option>
        </select>
      </div>

      <div class="form-group" v-if="roomtype_id > -1">
        <label for="room_id">Ort</label>
        <select v-model="task.room_id" class="form-control" name="room_id" id="room_id">
          <option v-for="(room, index) in rooms" :value="room.id">{{ room.name }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="title">Foto</label>
        <input
          v-on:change="handleFileUpload"
          type="file"
          name="file"
          id="file"
          class="form-control"
          ref="file"
          accept="image/*"
        >
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button type="button" @click="createTask" class="btn btn-outline-light">Aufgabe erstellen</button>
      </div>
    </form>
  </div>
</template>

<script>
import Successful from "../common/Successful.vue";
export default {
  components: {
    Successful
  },
  data() {
    return {
      success: false,
      task: {
        title: "",
        description: "",
        tasktype_id: "",
        priority: 5,
        room_id: ""
      },
      roomtype_id: -1,
      tasktypes: [],
      roomtypes: [],
      rooms: [],
      errors: []
    };
  },

  watch: {
    roomtype_id: function(id) {
      this.fetchRooms(id);
    }
  },

  mounted() {
    this.$store.commit("changePage", "Neue Aufgabe");
    this.fetchTasktypes();
    this.fetchRoomtypes();
  },

  methods: {
    createTask() {
      this.success = false;
      console.log(this.task.file);
      const formData = new FormData();
      formData.append("title", this.task.title);
      formData.append("description", this.task.description);
      formData.append("priority", this.task.priority);
      formData.append("tasktype_id", this.task.tasktype_id);
      formData.append("room_id", this.task.room_id);
      formData.append("file", this.task.file);
      axios
        .post(
          "http://localhost:8000/api/auth/group/" +
            this.$route.params.id +
            "/task/create",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        .then(response => {
          console.log(response.data);
          this.$emit("newtask");
          this.success = true;
          setTimeout(this.reset, 1000);
        })
        .catch(error => {
          this.errors = [];
          console.log(error.response);

          if (error.response.data.errors && error.response.data.errors.title) {
            this.errors.push(error.response.data.errors.title[0]);
          }
          if (
            error.response.data.errors &&
            error.response.data.errors.description
          ) {
            this.errors.push(error.response.data.errors.description[0]);
          }

          if (
            error.response.data.errors &&
            error.response.data.errors.tasktype
          ) {
            this.errors.push(error.response.data.errors.tasktype[0]);
          }
        });
    },
    reset() {
      this.task.title = "";
      this.task.description = "";
      this.task.tasktype_id = "";
      this.task.priority = 5;
      this.task.roomtype = "";
      this.task.roomname = "";
      history.back();
    },
    fetchTasktypes() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          "http://localhost:8000/api/auth/group/" +
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
          "http://localhost:8000/api/auth/group/" +
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
        .get("http://localhost:8000/api/auth/roomtype/" + id + "/rooms")
        .then(response => {
          this.rooms = response.data.rooms;
          console.log(response.data);
          this.loading = false;
        })
        .catch(error => {
          console.log(error.data);
        });
    },
    handleFileUpload() {
      console.log(this.$refs);
      this.task.file = this.$refs.file.files[0];
    }
  }
};
</script>

<style lang="scss">
.tudu-blu label {
  margin-bottom: 0;
  font-size: 0.9rem;
}

.success {
  z-index: 10;
  background-color: green;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}
</style>