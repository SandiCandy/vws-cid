<template>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <p>Welche Aufgabenbereiche möchtest du sehen?</p>
        <form>
          <div v-for="tt in tasktypes" v-bind:key="tt.id">
            <input type="checkbox" id="tasktypes" :name="tt.name" :value="tt.id" v-model="tt.show">
            <label for="tt.name">{{tt.name}}</label>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
        <button @click="submitFilter()" type="button" class="btn btn-danger">Bestätigen</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasktypes: []
    };
  },
  created() {
    this.readFiltering();
  },
  methods: {
    fetchTasktypes() {
      axios
        .get(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/tasktypes"
        )
        .then(response => {
          console.log(response.data);
          this.tasktypes = response.data.tasktypes;
          this.initFilter();
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    readFiltering() {
      if (localStorage.getItem("myTasktypes")) {
        console.log("read localstorage");
        this.tasktypes = JSON.parse(localStorage.getItem("myTasktypes"));
      } else {
        console.log("localstorage is empty");
        this.fetchTasktypes();
      }
    },
    initFilter() {
      this.tasktypes.forEach(function(el) {
        el.show = true;
      });
      localStorage.setItem("myTasktypes", JSON.stringify(this.tasktypes));
    },
    submitFilter() {
      localStorage.setItem("myTasktypes", JSON.stringify(this.tasktypes));
      this.$emit("setFilter");
    }
  }
};
</script>