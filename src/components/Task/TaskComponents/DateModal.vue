<template>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <p>Datetimemodal... {{date}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
        <button @click="doSomething()" type="button" class="btn btn-danger">Bestätigen</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    date: String
  },
  methods: {
    doSomething() {
      console.log("Done");
    }
  }
};
</script>