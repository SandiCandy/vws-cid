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
      <label for="tasktype_id">Ausführbar ab *</label>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <date-menu
            v-bind:old_date="startet_at_date"
            my_label="Ausführbar ab"
            emit="startdate"
            v-on:startdate="updateTaskDate"
          ></date-menu>
        </v-col>

        <v-col cols="11" sm="5">
          <time-menu
            v-bind:old_time="startet_at_time"
            my_label="Startzeit"
            emit="starttime"
            v-on:starttime="updateTaskTime"
          ></time-menu>
        </v-col>
      </v-row>
    </div>

    <div class="form-group">
      <label for="tasktype_id">Erledigung bis</label>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <date-menu
            v-bind:old_date="deadline_date"
            my_label="Erledigung bis"
            emit="deadlinedate"
            v-on:deadlinedate="updateDeadlineDate"
          ></date-menu>
        </v-col>

        <v-col cols="11" sm="5">
          <time-menu
            v-bind:old_time="deadline_time"
            my_label="Endzeit"
            emit="deadlinetime"
            v-on:deadlinetime="updateDeadlineTime"
          ></time-menu>
        </v-col>
      </v-row>
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
import DateMenu from "./DateMenu.vue";
import TimeMenu from "./TimeMenu.vue";

export default {
  components: {
    DateMenu,
    TimeMenu
  },
  props: {
    task: Object,
    roomtype_id: Number
  },
  data() {
    return {
      startet_at_date: this.moment(this.task.startet_at).format("YYYY-MM-DD"),
      startet_at_time: this.moment(this.task.startet_at).format("LT"),
      deadline_date: this.moment(this.task.deadline_at).format("YYYY-MM-DD"),
      deadline_time: this.moment(this.task.deadline_at).format("LT"),
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
      return this.task.file && this.task.file.size > 15000000;
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
    if (this.deadline_date === "Invalid date") {
      this.deadline_date = null;
    }
    if (this.deadline_time === "Invalid date") {
      this.deadline_time = null;
    }
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
      this.task.startet_at = this.moment(
        this.startet_at_date + " " + this.startet_at_time
      ).format();
      formData.append("startet_at", this.task.startet_at);
      if (this.deadline_time && this.deadline_date) {
        this.task.deadline_at = this.moment(
          this.deadline_date + " " + this.deadline_time
        ).format();
        console.log(this.task.deadline_at);
        formData.append("deadline_at", this.task.deadline_at);
      }
      formData.append("priority", this.task.priority);
      formData.append("tasktype_id", this.task.tasktype_id);
      if (this.task.room_id) {
        formData.append("room_id", this.task.room_id);
      }
      formData.append("file", this.task.file);
      formData.append("is_done", +this.task.is_done);
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
      history.back();
    },
    updateTaskDate(val) {
      this.startet_at_date = val;
    },
    updateTaskTime(val) {
      this.startet_at_time = val;
    },
    updateDeadlineDate(val) {
      this.deadline_date = val;
    },
    updateDeadlineTime(val) {
      this.deadline_time = val;
    }
  }
};
</script>
