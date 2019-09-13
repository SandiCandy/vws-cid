<template>
  <div class="tudu-blu min-h-100">
    <div v-if="success">
      <successful msg="Aufgabe erfolgreich angelegt."></successful>
    </div>
    <loading class="upload" v-if="is_uploading"></loading>
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
          <option v-for="ttype in tasktypes" :key="ttype.id" :value="ttype.id">{{ ttype.name }}</option>
        </select>
        <div class="invalid-feedback">Bitte gib einen Aufgabentypen an.</div>
      </div>

      <div class="form-group">
        <label for="tasktype_id">Ausführbar ab *</label>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <date-menu
              v-bind:old_date="task.startet_at_date"
              my_label="Ausführbar ab"
              emit="startdate"
              v-on:startdate="updateTaskDate"
            ></date-menu>
          </v-col>

          <v-col cols="11" sm="5">
            <time-menu
              v-bind:old_time="task.startet_at_time"
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
              v-bind:old_date="task.deadline_date"
              my_label="Erledigung bis"
              emit="deadlinedate"
              v-on:deadlinedate="updateDeadlineDate"
              class="datepicker-formcontrol"
              v-bind:class="{ 'is-invalid': attemptSubmit && invalidDeadline }"
              :key="task.deadline_date"
            ></date-menu>
            <div class="invalid-feedback">Das Enddatum muss hinter dem Startdatum liegen.</div>
          </v-col>

          <v-col cols="9" sm="5">
            <time-menu
              v-bind:old_time="task.deadline_time"
              my_label="Endzeit"
              emit="deadlinetime"
              v-on:deadlinetime="updateDeadlineTime"
              class="datepicker-formcontrol"
              v-bind:class="{ 'is-invalid': attemptSubmit && invalidDeadlineTime }"
              :key="task.deadline_time"
            ></time-menu>
            <div class="invalid-feedback">Bitte gebe eine Uhrzeit an.</div>
          </v-col>

          <v-col cols="3">
            <v-btn
              class="mx-2 my-4"
              text
              icon
              small
              color="red"
              @click="removeDeadline"
              :disabled="(task.deadline_time === null && task.deadline_date === null)"
            >
              <v-icon dark>mdi-close</v-icon>
            </v-btn>
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

      <div class="form-group" v-if="roomtypes.length > 0">
        <label for="roomtype_id">Bereich</label>
        <select v-model="roomtype_id" class="form-control" name="roomtype_id" id="roomtype_id">
          <option value="-1"></option>

          <option
            v-for="rtype in roomtypes"
            :key="rtype.id"
            :value="rtype.id"
          >{{ rtype.name }} ({{ rtype.rooms_count}} Orte)</option>
        </select>
      </div>

      <div class="form-group" v-if="roomtype_id > -1">
        <label for="room_id">Ort</label>
        <select v-model="task.room_id" class="form-control" name="room_id" id="room_id">
          <option v-for="room in rooms" :key="room.id" :value="room.id">{{ room.name }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="title">Foto</label>
        <input
          v-on:change="handleFileUpload($event.target.name, $event.target.files)"
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

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button type="button" @click="createTask" class="btn btn-outline-light">Aufgabe erstellen</button>
      </div>
    </form>
  </div>
</template>

<script>
import Successful from "../common/Successful.vue";
import Loading from "../common/Loading.vue";
import DateMenu from "./TaskComponents/DateMenu.vue";
import TimeMenu from "./TaskComponents/TimeMenu.vue";

export default {
  components: {
    DateMenu,
    TimeMenu,
    Successful,
    Loading
  },
  data() {
    return {
      success: false,
      attemptSubmit: false,
      is_uploading: false,
      fileTooLarge: false,
      task: {
        title: "",
        description: "",
        tasktype_id: "",
        priority: 5,
        room_id: "",
        startet_at_date: this.moment().format("YYYY-MM-DD"),
        startet_at_time: this.moment().format("HH:mm"),
        deadline_time: null,
        deadline_date: null,
        deadline_at: null
      },
      roomtype_id: -1,
      tasktypes: [],
      roomtypes: [],
      rooms: [],
      errors: []
    };
  },
  computed: {
    requiredTitle() {
      return this.task.title === "";
    },
    requiredTasktype() {
      return this.task.tasktype_id === "";
    },
    invalidDeadline() {
      return (
        this.task.deadline_date !== null &&
        this.moment(this.task.startet_at_date).isAfter(this.task.deadline_date)
      );
    },
    invalidDeadlineTime() {
      return (
        this.task.deadline_date !== null && this.task.deadline_time === null
      );
    }
  },

  watch: {
    roomtype_id: function(id) {
      this.fetchRooms(id);
    }
  },

  created() {
    this.$store.commit("changePage", "Neue Aufgabe");
    this.fetchTasktypes();
    this.fetchRoomtypes();
  },

  methods: {
    createTask() {
      if (this.invalidInput()) {
        return true;
      }
      this.is_uploading = true;
      this.success = false;

      this.task.startet_at = this.moment(
        this.task.startet_at_date + " " + this.task.startet_at_time
      ).format();

      console.log(this.task);
      let formData = new FormData();
      formData.append("title", this.task.title);
      formData.append("description", this.task.description);
      formData.append("priority", this.task.priority);
      formData.append("startet_at", this.task.startet_at);

      if (
        this.task.deadline_date !== null &&
        this.task.deadline_time !== null
      ) {
        this.task.deadline_at = this.moment(
          this.task.deadline_date + " " + this.task.deadline_time
        ).format();
        formData.append("deadline_at", this.task.deadline_at);
      }
      formData.append("tasktype_id", this.task.tasktype_id);
      formData.append("room_id", this.task.room_id);
      if (this.task.file) {
        formData.append("file", this.task.file);
      }
      axios
        .post(
          process.env.ROOT_API +
            "/auth/group/" +
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
          this.is_uploading = false;
          setTimeout(this.reset, 1000);
        })
        .catch(error => {
          this.is_uploading = false;
          this.errors = [];
          console.log(error.response);
        });
    },
    reset() {
      this.task.title = "";
      this.task.description = "";
      this.task.tasktype_id = "";
      this.task.priority = 5;
      this.task.roomtype = "";
      this.task.roomname = "";
      this.attemptSubmit = false;
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
      this.$store.commit("isLoading", true);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get(process.env.ROOT_API + "/auth/roomtype/" + id + "/rooms")
        .then(response => {
          this.rooms = response.data.rooms;
          console.log(response.data);
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          console.log(error.response);
          this.$store.commit("isLoading", true);
        });
    },
    handleFileUpload() {
      this.task.file = this.$refs.file.files[0];
      this.checkFileSize();
    },
    checkFileSize() {
      this.fileTooLarge =
        this.task.file && this.task.file.size > 15000000 ? true : false;
    },
    invalidInput() {
      this.attemptSubmit = true;
      this.errors = [];
      if (
        this.requiredTitle ||
        this.requiredTasktype ||
        this.fileTooLarge ||
        this.invalidDeadline ||
        this.invalidDeadlineTime
      )
        return true;
    },
    updateTaskDate(val) {
      this.task.startet_at_date = val;
    },
    updateTaskTime(val) {
      this.task.startet_at_time = val;
    },
    updateDeadlineDate(val) {
      this.task.deadline_date = val;
    },
    updateDeadlineTime(val) {
      this.task.deadline_time = val;
    },
    removeDeadline() {
      this.updateDeadlineDate(null);
      this.updateDeadlineTime(null);
    }
  }
};
</script>

<style lang="scss" scoped>
.tudu-blu label {
  margin-bottom: 0;
  font-size: 0.9rem;
}

.success {
  z-index: 10;
  background-color: $green;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}

.upload {
  z-index: 10;
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  background-color: rgba(255, 255, 255, 0.6);
  color: $highlight-color;
  padding-top: 30vh;
}

.upload::after {
  content: "Uploading ...";
  top: 45vh;
  left: calc(50vw - 8rem);
  position: inherit;
  font-size: 1.5rem;
}
</style>