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
          >
            <option
              v-for="ttype in tasktypes"
              :value="ttype.id"
              v-bind:key="ttype.id"
            >{{ ttype.name }}</option>
          </select>
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
          <div class="invalid-feedback">Bitte gib einen Aufgabentypen an.</div>
        </div>

        <div class="form-group">
          <label for="dtstart">Erste Ausführung</label>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <date-menu
                v-bind:old_date="moment(tasktemplate.dtstart).format('YYYY-MM-DD')"
                my_label="Erster Termin"
                emit="startdate"
                v-on:startdate="updateTaskDate"
              ></date-menu>
            </v-col>
          </v-row>
          <!-- <datepicker v-model="dtstart"></datepicker> -->
        </div>

        <div class="form-group">
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="freq1"
              id="freq1"
              value="daily"
              v-model="tasktemplate.freq"
            />
            <label class="form-check-label" for="freq1">Täglich</label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="freq2"
              id="freq2"
              value="weekly"
              v-model="tasktemplate.freq"
            />
            <label class="form-check-label" for="freq2">Wöchentlich</label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="freq3"
              id="freq3"
              value="monthly"
              v-model="tasktemplate.freq"
            />
            <label class="form-check-label" for="freq3">Monatlich</label>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="freq"
              id="freq4"
              value="yearly"
              v-model="tasktemplate.freq"
            />
            <label class="form-check-label" for="freq4">Jährlich</label>
          </div>
        </div>

        <div class="form-group">
          <button type="button" @click="reset" class="btn btn-link text-tudu-blu pl-0">Abbrechen</button>
          <button type="button" @click="updateTasktemplate" class="btn tudu-blu">Änderung speichern</button>
        </div>
      </form>
      <hr />
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
      <delete-tasktemplate-modal
        v-bind:tasktemplate="tasktemplate"
        v-on:tasktemplateDeleted="removeDeletedTasktemplate"
      ></delete-tasktemplate-modal>
    </div>
  </div>
</template>

<script>
import DateMenu from "../Task/TaskComponents/DateMenu.vue";
import Loading from "../common/Loading.vue";
import DeleteTasktemplateModal from "./Components/DeleteTasktemplateModal.vue";
export default {
  components: {
    DateMenu,
    DeleteTasktemplateModal,
    Loading
  },
  data() {
    return {
      success: false,
      errors: [],
      error: null,
      tasktemplate: {},
      tasktypes: [],
      attemptSubmit: false
    };
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
    this.$store.commit("changePage", "Wiederholende Aufgabe ändern");
    this.fetchTasktemplate();
    this.fetchTasktypes();
  },

  methods: {
    updateTasktemplate() {
      this.validateInput();
      this.success = false;
      let formData = new FormData();
      formData.append("title", this.tasktemplate.title);
      if (this.tasktemplate.description) {
        formData.append("description", this.tasktemplate.description);
      }
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
            "/auth/tasktemplates/" +
            this.tasktemplate.id +
            "/update",
          formData
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
    fetchTasktemplate() {
      this.$store.commit("isLoading", true);
      this.error = null;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          process.env.ROOT_API + "/auth/tasktemplates/" + this.$route.params.tid
        )
        .then(response => {
          this.tasktemplate = response.data.tasktemplate;
          console.log(response.data);
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          console.log(error.response);
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
        });
    },
    reset() {
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
    validateInput() {
      this.attemptSubmit = true;
      this.errors = [];
      if (this.requiredTitle || this.requiredTasktype) event.preventDefault();
    },
    removeDeletedTasktemplate() {
      this.$emit("deletetasktemplatemodal", this.index);
      history.back();
    },
    updateTaskDate(val) {
      this.tasktemplate.dtstart = this.moment(val).format();
    }
  }
};
</script>

