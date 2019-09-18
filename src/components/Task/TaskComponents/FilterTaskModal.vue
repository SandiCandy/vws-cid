<template>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <p>Welche Aufgabenbereiche möchtest du sehen?</p>
        <form>
          <div v-for="tt in tasktypes" v-bind:key="tt.id">
            <div class="form-check">
              <input
                type="checkbox"
                id="tasktypes"
                class="form-check-input"
                :name="tt.name"
                :value="tt.id"
                v-model="tt.show"
              />
              <label for="tt.name" class="form-check-label">{{tt.name}}</label>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
        <button @click="submitFilter()" type="button" class="btn btn-success">Bestätigen</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tasktypes: Array
  },
  methods: {
    submitFilter() {
      localStorage.setItem(
        this.$route.params.id,
        JSON.stringify(this.tasktypes)
      );
      this.$emit("setFilter");
      $("#filterModal").modal("hide");
    }
  }
};
</script>