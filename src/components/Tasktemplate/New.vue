<template>
  <div class="tudu-blu min-h-100">
    <div v-if="success">
      <successful msg="Aufgabe erfolgreich angelegt."></successful>
    </div>
    <div class="alert alert-danger" v-if="errors.length > 0">
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>

    <form class="col-sm-12">
      <div class="form-group">
        <label for="title">Name *</label>
        <input
          type="text"
          name="title"
          id="title"
          class="form-control"
          v-model="tasktemplate.title"
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
          v-model="tasktemplate.description"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="tasktype_id">Aufgabenart *</label>
        <select
          v-model="tasktemplate.tasktype_id"
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
        <label for="priority">Priorität *</label>
        <select
          v-model="tasktemplate.priority"
          class="form-control"
          name="priority"
          id="priority"
          v-bind:class="{ 'is-invalid': attemptSubmit && requiredPrio }"
        >
          <option value="0">Niedrig</option>
          <option value="5">Normal</option>
          <option value="10">Hoch</option>
        </select>
        <div class="invalid-feedback">Gib bitte eine Priorität.</div>
      </div>

      <div class="form-group">
        <label for="dtstart">Erste Ausführung</label>
        <v-row>
          <v-col>
            <date-menu
              v-bind:old_date="tasktemplate.dtstart"
              my_label="Erste Ausführung"
              emit="firstdate"
              v-on:firstdate="updateTaskDate"
            ></date-menu>
          </v-col>
        </v-row>
      </div>

      <div class="form-group">
        <p>Rhythmus</p>
        <v-radio-group v-model="tasktemplate.freq" row dark>
          <v-radio label="Täglich" value="daily"></v-radio>
          <v-radio label="Wöchentlich" value="weekly"></v-radio>
          <v-radio label="Monatlich" value="monthly"></v-radio>
          <v-radio label="Jährlich" value="yearly"></v-radio>
        </v-radio-group>
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button
          type="button"
          @click="createTasktemplate"
          class="btn btn-outline-light"
        >Aufgaben erstellen</button>
      </div>
    </form>
  </div>
</template>

<script>
import { fetchTasktypesMixin } from "../../mixins/fetchTasktypesMixin";
import DateMenu from "../Task/TaskComponents/DateMenu.vue";
import Successful from "../common/Successful.vue";
export default {
  mixins: [fetchTasktypesMixin],
  components: {
    Successful,
    DateMenu
  },
  data() {
    return {
      success: false,
      attemptSubmit: false,
      tasktemplate: {
        title: "",
        description: "",
        tasktype_id: "",
        priority: 5,
        dtstart: this.moment().format("YYYY-MM-DD"),
        freq: "daily"
      },
      //tasktypes: [],
      errors: []
    };
  },

  watch: {
    roomtype_id: function(id) {
      this.fetchRooms(id);
    }
  },

  computed: {
    requiredTitle() {
      return this.tasktemplate.title === "";
    },
    requiredTasktype() {
      return this.tasktemplate.tasktype_id === "";
    },
    requiredPrio() {
      return this.tasktemplate.priority === "";
    }
  },

  created() {
    this.$store.commit("changePage", "Neue Aufgabe");
    //this.fetchTasktypes();
    this.fetchRoomtypes();
  },

  methods: {
    createTasktemplate() {
      if (this.invalidInput()) {
        return true;
      }
      this.success = false;
      let formData = new FormData();
      formData.append("title", this.tasktemplate.title);
      formData.append("description", this.tasktemplate.description);
      formData.append("priority", this.tasktemplate.priority);
      formData.append("tasktype_id", this.tasktemplate.tasktype_id);
      formData.append("freq", this.tasktemplate.freq);
      formData.append(
        "dtstart",
        this.moment(this.tasktemplate.dtstart).format()
      );
      axios
        .post(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/tasktemplates/create",
          formData
        )
        .then(response => {
          console.log(response.data);
          this.success = true;
          setTimeout(this.reset, 800);
        })
        .catch(error => {
          this.errors = [];
          console.log(error.response);
        });
    },
    reset() {
      history.back();
    },
    // fetchTasktypes() {
    //   axios.defaults.headers.common["Authorization"] =
    //     "Bearer " + $cookies.get("token");
    //   axios
    //     .get(
    //       process.env.ROOT_API +
    //         "/auth/group/" +
    //         this.$route.params.id +
    //         "/tasktypes"
    //     )
    //     .then(response => {
    //       console.log(response.data);
    //       this.tasktypes = response.data.tasktypes;
    //     })
    //     .catch(error => {
    //       console.log(error.response);
    //     });
    // },
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
      console.log(this.$refs);
      this.task.file = this.$refs.file.files[0];
    },
    invalidInput() {
      this.attemptSubmit = true;
      this.errors = [];
      if (this.requiredTitle || this.requiredTasktype) return true;
    },
    updateTaskDate(val) {
      this.tasktemplate.dtstart = val;
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

.tudu-blu.vh-100 {
  min-height: 120vh;
}

.datetimeselect {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  background-color: #ffffff;
  line-height: 1.5;
  padding: 0.375rem 0.75rem;
}
</style>