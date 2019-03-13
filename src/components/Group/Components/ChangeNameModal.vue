<template>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <form class="modal-body">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" name="name" id="name" class="form-control" v-model="name">
        </div>
      </form>
      <div class="modal-footer">
        <button @click="reset()" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
        <button @click="changeName()" type="button" class="btn btn-success">Ändern</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: this.setting
    };
  },
  watch: {
    setting(newVal, oldVal) {
      this.name = newVal;
    }
  },
  props: ["setting"],
  methods: {
    changeName() {
      axios
        .put(
          "http://localhost:8000/api/auth/group/" +
            this.$route.params.id +
            "/update",
          {
            name: this.name
          }
        )
        .then(response => {
          console.log(response.data);
          $("#changeNameModal").modal("hide");
          this.$emit("changed", response.data.group);
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    reset() {
      this.name = this.setting;
    }
  }
};
</script>