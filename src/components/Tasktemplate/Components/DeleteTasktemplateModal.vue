<template>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <p>Möchtest du "{{ tasktemplate.title}}" wirklich löschen?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
        <button
          @click="deleteTasktemplate(tasktemplate.id)"
          type="button"
          class="btn btn-danger"
        >Löschen</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["tasktemplate"],
  methods: {
    deleteTasktemplate(id) {
      axios
        .delete(process.env.ROOT_API + "/auth/tasktemplates/" + id)
        .then(response => {
          $("#deleteModal").modal("hide");
          this.$emit("tasktemplateDeleted", id);
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>