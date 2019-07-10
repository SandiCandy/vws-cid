<template>
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
      />
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

    <div class="form-group" v-if="task.images && task.images.length > 0">Bildupload nicht verfügbar.</div>
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
      />
      <div class="invalid-feedback">Deine Datei ist leider zu groß.</div>
    </div>

    <div class="form-group" v-if="task.editor_id">
      <input type="checkbox" id="is_done" name="is_done" v-model="task.is_done" />
      <label for="checkbox">Aufgabe erledigt</label>
    </div>

    <div class="form-group">
      <button type="button" @click="reset" class="btn btn-link text-tudu-blu pl-0">Abbrechen</button>
      <button type="button" @click="updateTask" class="btn tudu-blu">Änderung speichern</button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    task: Object,
    roomtype_id: Number
  },
  data() {
    return {
      success: false,
      error: null,
      tasktypes: [],
      roomtypes: [],
      rooms: [],
      attemptSubmit: false
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
          this.success = true;
          setTimeout(this.reset, 1000);
        })
        .catch(error => {
          console.log(error.response);
        });
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
      if (this.requiredTitle || this.requiredTasktype || this.fileTooLarge)
        event.preventDefault();
    },
    reset() {
      this.task.title = "";
      this.task.description = "";
      this.task.tasktype_id = "";
      //history.back();
      this.$router.push({
        name: "tasks.current",
        params: { id: this.$route.params.id }
      });
    }
  }
};
</script>
