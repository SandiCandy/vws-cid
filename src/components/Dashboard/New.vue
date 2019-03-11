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
        <input type="text" name="name" id="name" class="form-control" v-model="group.name">
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-link text-white">Abbrechen</button>
        <button type="button" @click="createGroup" class="btn btn-outline-light">Gruppe erstellen</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      group: {
        name: ""
      },
      errors: []
    };
  },
  mounted() {
    this.$store.commit("changePage", "Neue Gruppe");
  },

  methods: {
    createGroup() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .post("http://localhost:8000/api/auth/group/create", {
          name: this.group.name
        })
        .then(response => {
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
      this.group.name = "";
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