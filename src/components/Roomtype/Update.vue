<template>
  <div class="tudu-blu row vh-100">
    <div class="alert alert-danger" v-if="errors.length > 0">
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </div>

    <form class="col-sm-12">
      <div class="form-group">
        <label for="name">Name *</label>
        <input type="text" name="name" id="name" class="form-control" v-model="roomtype.name">
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button
          type="button"
          @click="updateRoomtype"
          class="btn btn-outline-light"
        >Änderung speichern</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roomtype: {
        name: ""
      },
      errors: []
    };
  },
  mounted() {
    this.$store.commit("changePage", "Bereich ändern");
    this.fetchRoomtype();
  },

  methods: {
    fetchRoomtype() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get(
          process.env.ROOT_API + "/auth/group/roomtypes/" +
            this.$route.params.rtid
        )
        .then(response => {
          this.roomtype = response.data.roomtype;
          console.log(response.data);
        })
        .catch(error => {
          console.log(error.data);
        });
    },
    updateRoomtype() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .put(
          process.env.ROOT_API + "/auth/group/" +
            this.$route.params.id +
            "/roomtypes/" +
            this.$route.params.rtid +
            "/update",
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