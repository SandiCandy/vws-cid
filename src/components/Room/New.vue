<template>
  <div class="tudu-blu min-h-100">
    <div v-if="success">
      <successful msg="Aufgabe erfolgreich angelegt."></successful>
    </div>
    <div class="alert alert-danger" v-if="errors.length > 0">
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </div>

    <form class="col-sm-12">
      <div class="form-group">
        <label for="name">Name *</label>
        <input
          type="text"
          name="name"
          id="name"
          class="form-control"
          v-model="room.name"
          v-bind:class="{ 'is-invalid': attemptSubmit && requiredTitle }"
        />
        <div class="invalid-feedback">Gib bitte dem Ort eine Bezeichnung.</div>
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button type="button" @click="createRoom" class="btn btn-outline-light">Ort erstellen</button>
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
      attemptSubmit: false,
      room: {
        name: ""
      },
      errors: [],
      success: false
    };
  },
  computed: {
    requiredTitle() {
      return this.room.name === "";
    }
  },
  mounted() {
    this.$store.commit("changePage", "Neuer Ort");
  },

  methods: {
    createRoom() {
      this.validateInput();
      this.success = false;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .post(
          process.env.ROOT_API +
            "/auth/roomtype/" +
            this.$route.params.id +
            "/room/create",
          {
            name: this.room.name
          }
        )
        .then(response => {
          this.success = true;
          this.$emit("newroom");
          console.log(response.data);
          this.reset();
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
      this.room.name = "";
      this.$router.push({
        name: "rooms.show",
        params: { id: this.$route.params.id }
      });
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