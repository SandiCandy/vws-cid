<template>
  <div class="modal-dialog modal-time" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <v-time-picker v-model="time" format="24hr"></v-time-picker>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
        <button @click="submit(time)" type="button" class="btn btn-danger">Bestätigen</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: null
    };
  },
  methods: {
    submit(time) {
      console.log(time);
      $("#timeModal").modal("hide");
      this.$emit("newTime", time);
    }
  }
};
</script>

<style lang="scss">
.modal-time .v-picker {
  box-shadow: 0 0;
}
.modal-time .v-picker .v-time-picker-title {
  color: #000000;
  justify-content: center;
}

div.modal-dialog.modal-time {
  width: 320px;
}
</style>