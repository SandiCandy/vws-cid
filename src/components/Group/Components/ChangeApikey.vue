<template>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <form class="modal-body">
        <div class="form-group">
          <label for="name">Apikey</label>
          <input type="text" name="apikey" id="apikey" class="form-control" v-model="apikey">
        </div>
      </form>
      <div class="modal-footer">
        <button
          @click="reset()"
          type="button"
          class="btn text-secondary"
          data-dismiss="modal"
        >Abbrechen</button>
        <button @click="changeApikey()" type="button" class="btn btn-success">Ändern</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apikey: this.setting
    };
  },
  watch: {
    setting(newVal, oldVal) {
      this.apikey = newVal;
    }
  },
  props: ["setting"],
  methods: {
    changeApikey() {
      axios
        .put(
          process.env.ROOT_API + "/auth/group/" +
            this.$route.params.id +
            "/update",
          {
            apikey: this.apikey
          }
        )
        .then(response => {
          console.log(this.apikey);
          console.log(response.data);
          $("#changeApikeyModal").modal("hide");
          this.$emit("changed", response.data.group);
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    reset() {
      this.apikey = this.setting;
    }
  }
};
</script>