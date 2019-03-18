<template>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <form class="modal-body">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="email" name="email" id="email" class="form-control" v-model="email">
        </div>
      </form>
      <div class="modal-footer">
        <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
        <button @click="changeEmail()" type="button" class="btn btn-success">Ändern</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: this.setting
    };
  },
  watch: {
    setting(newVal) {
      this.email = newVal;
    }
  },
  props: ["setting"],
  methods: {
    changeEmail() {
      axios
        .put(process.env.ROOT_API + "/auth/settings/update", {
          email: this.email
        })
        .then(response => {
          $("#changeMailModal").modal("hide");
          this.$emit("changed", response.data.user);
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>