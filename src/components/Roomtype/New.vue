<template>
  <div class="tudu-blu .min-h-100">
    <form class="col-sm-12">
      <div class="form-group">
        <label for="name">Name *</label>
        <input
          type="text"
          name="name"
          id="name"
          class="form-control"
          v-model="roomtype.name"
          v-bind:class="{ 'is-invalid': attemptSubmit && requiredTitle }"
        />
        <div class="invalid-feedback">Gib bitte dem Bereich eine Bezeichnung.</div>
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button
          type="button"
          @click="createRoomtype"
          class="btn btn-outline-light"
        >Bereich erstellen</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      attemptSubmit: false,
      roomtype: {
        name: ""
      },
      errors: []
    };
  },
  computed: {
    requiredTitle() {
      return this.roomtype.name === "";
    }
  },
  mounted() {
    this.$store.commit("changePage", "Neuer Bereich");
  },

  methods: {
    createRoomtype() {
      this.validateInput();
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .post(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/roomtype/create",
          {
            name: this.roomtype.name
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
      this.roomtype.name = "";
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