<template>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <p>Möchtest du "{{ user.name}}" wirklich aus der Gruppe entfernen?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
        <button @click="deleteUser(user.id)" type="button" class="btn btn-danger">Entfernen</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["user"],
  methods: {
    deleteUser(id) {
      axios
        .delete(
          "http://localhost:8000/api/auth/group/" +
            this.$route.params.id +
            "/member/" +
            id
        )
        .then(response => {
          $("#deleteModal").modal("hide");
          this.$emit("userDeleted", id);
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>