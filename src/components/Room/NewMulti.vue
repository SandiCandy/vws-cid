<template>
  <div class="tudu-blu vh-100">
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
        <label for="startnum">Präfix</label>
        <input type="text" name="prefix" id="prefix" class="form-control" v-model="room.prefix">
      </div>

      <div class="form-group">
        <label for="startnum">Startwert</label>
        <input
          type="number"
          name="startnum"
          id="startnum"
          class="form-control"
          v-model="room.startnum"
          v-bind:class="{ 'is-invalid': attemptSubmit && startnumTooSmall }"
        >
        <div class="invalid-feedback">Bitte gib einen positiven Wert an.</div>
      </div>

      <div class="form-group">
        <label for="count">Anzahl</label>
        <input
          type="number"
          name="count"
          id="count"
          class="form-control"
          v-model="room.count"
          v-bind:class="{ 'is-invalid': attemptSubmit && countTooSmall }"
        >
        <div class="invalid-feedback">Bitte gib eine positive Zahl an.</div>
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button
          type="button"
          @click="createRooms"
          class="btn btn-outline-light"
        >{{room.count}} Orte anlegen</button>
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
      success: false,
      attemptSubmit: false,
      room: {
        prefix: "",
        startnum: 1,
        count: 0
      },
      errors: []
    };
  },
  computed: {
    startnumTooSmall() {
      return this.room.startnum <= 0;
    },
    countTooSmall() {
      return this.room.count <= 0;
    }
  },
  mounted() {
    this.$store.commit("changePage", "Neue Orte");
  },

  methods: {
    createRooms() {
      this.validateInput();
      this.success = false;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .post(
          process.env.ROOT_API +
            "/auth/roomtype/" +
            this.$route.params.id +
            "/room/create/multi",
          {
            prefix: this.room.prefix,
            startnum: this.room.startnum,
            count: this.room.count
          }
        )
        .then(response => {
          this.success = true;
          this.$emit("newrooms");
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
      if (this.startnumTooSmall || this.countTooSmall) event.preventDefault();
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