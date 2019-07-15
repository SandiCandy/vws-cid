<template>
  <div class="tudu-blu min-h-100">
    <div v-if="success">
      <successful msg="Aufgabentyp erfolgreich angelegt."></successful>
    </div>

    <form class="col-sm-12">
      <div class="form-group">
        <label for="name">Name *</label>
        <input
          type="text"
          name="name"
          id="name"
          class="form-control"
          v-model="tasktype.name"
          v-bind:class="{ 'is-invalid': attemptSubmit && requiredTitle }"
        />
        <div class="invalid-feedback">Gib bitte dem Aufgabenbereich eine Bezeichnung.</div>
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button
          type="button"
          @click="createTasktype"
          class="btn btn-outline-light"
        >Aufgabenart erstellen</button>
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
      tasktype: {
        name: ""
      },
      errors: [],
      success: false,
      attemptSubmit: false
    };
  },
  computed: {
    requiredTitle() {
      return this.tasktype.name === "";
    }
  },
  mounted() {
    this.$store.commit("changePage", "Neue Aufgabenart");
  },

  methods: {
    createTasktype() {
      this.validateInput();
      this.success = false;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .post(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/tasktype/create",
          {
            name: this.tasktype.name
          }
        )
        .then(response => {
          this.$emit("newtasktype");
          console.log(response.data);
          this.success = true;
          this.removeLocalstorage();
          setTimeout(this.reset, 1000);
        })
        .catch(error => {
          this.errors = [];
          console.log(error.response);

          if (error.response.data.errors && error.response.data.errors.name) {
            this.errors.push(error.response.data.errors.name[0]);
          }
        });
    },
    reset() {
      this.tasktype.name = "";
      history.back();
    },
    removeLocalstorage() {
      localStorage.removeItem(this.$route.params.id);
    },
    validateInput() {
      this.attemptSubmit = true;
      this.errors = [];
      if (this.requiredTitle) event.preventDefault();
    }
  }
};
</script>

<style lang="scss">
.tudu-blu label {
  margin-bottom: 0;
  font-size: 0.9rem;
}
.full-width {
  margin-left: -15px;
}
</style>