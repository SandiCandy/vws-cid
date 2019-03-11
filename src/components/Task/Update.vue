<template>
  <div class="tudu-blu row vh-100">
    <div class="alert alert-danger" v-if="errors.length > 0">
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </div>

    <form class="col-sm-12">
      <div class="form-group">
        <label for="title">Name</label>
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

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button type="button" @click="updateTask" class="btn btn-outline-light">Änderung speichern</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      success: false,
      errors: [],
      task: {},
      roomtype_id: -1,
      tasktypes: [],
      roomtypes: [],
      rooms: []
    };
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
      this.success = false;
      axios
        .put(
          "http://localhost:8000/api/auth/tasks/" + this.task.id + "/update",
          {
            title: this.task.title,
            description: this.task.description,
            priority: this.task.priority,
            tasktype_id: this.task.tasktype_id,
            room_id: this.task.room_id
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

          if (error.response.data && error.data.title) {
            this.errors.push(error.response.data.errors.title[0]);
          }

          if (error.response.data.errors.description) {
            this.errors.push(error.response.data.errors.description[0]);
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
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get("http://localhost:8000/api/auth/tasks/" + this.$route.params.tid)
        .then(response => {
          this.task = response.data.task;
          console.log(response.data);
          if (this.task.room_id) {
            this.getRoomtype(this.task.room_id);
          }
        })
        .catch(error => {
          console.log(error.data);
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
        })
        .catch(error => {
          console.log(error.data);
        });
    },
    getRoomtype(room_id) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get("http://localhost:8000/api/auth/room/" + room_id + "/roomtype")
        .then(response => {
          this.roomtype_id = response.data.roomtype.id;
          console.log(response.data);
        })
        .catch(error => {
          console.log(error.data);
        });
    }
  }
};
</script>