<template>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <p>Möchtest du "{{ group.name }}" wirklich löschen?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
        <button @click="deleteGroup(group.id)" type="button" class="btn btn-danger">Löschen</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["group"],
  methods: {
    deleteGroup(id) {
      axios
        .delete(
          process.env.ROOT_API + "/auth/group/" + id + process.env.VERSION
        )
        .then(response => {
          $("#deleteModal").modal("hide");
          this.$router.push({ name: "dashboard" });
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>