<template>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <p>Möchtest du "{{ task.title}}" wirklich löschen?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
        <button @click="deleteTask(task.id)" type="button" class="btn btn-danger">Löschen</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: Object
  },
  methods: {
    deleteTask(id) {
      axios
        .delete(process.env.ROOT_API + "/auth/tasks/" + id)
        .then(response => {
          $("#deleteModal").modal("hide");
          this.$emit("taskDeleted", id);
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>