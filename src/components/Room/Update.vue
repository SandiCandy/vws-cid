<template>
  <div class="tudu-blu vh-100">
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
        >
        <div class="invalid-feedback">Gib bitte dem Ort eine Bezeichnung.</div>
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button type="button" @click="updateRoom" class="btn btn-outline-light">Änderung speichern</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      room: {
        name: ""
      },
      errors: [],
      attemptSubmit: false
    };
  },
  computed: {
    requiredTitle() {
      return this.room.name === "";
    }
  },
  mounted() {
    this.$store.commit("changePage", "Ort ändern");
    this.fetchRoom();
  },

  methods: {
    fetchRoom() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get(
          process.env.ROOT_API +
            "/auth/roomtype/" +
            this.$route.params.id +
            "/rooms/" +
            this.$route.params.rid
        )
        .then(response => {
          this.room = response.data.room;
          console.log(response.data);
        })
        .catch(error => {
          console.log(error.data);
        });
    },
    updateRoom() {
      this.validateInput();
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .put(
          process.env.ROOT_API +
            "/auth/roomtype/" +
            this.$route.params.id +
            "/rooms/" +
            this.$route.params.rid +
            "/update",
          {
            name: this.room.name
          }
        )
        .then(response => {
          console.log(response);
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
      history.back();
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