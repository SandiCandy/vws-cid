<template>
  <div class="vh-100">
    <div class="loading d-flex justify-content-center" v-if="loading">
      <font-awesome-icon :icon="['fas', 'spinner']" class="display-4 d-flex justify-content-center"></font-awesome-icon>
    </div>
    <div class="content container" v-else>
      <p>Für eine optimale Organisation der Aufgaben kannst du eigene Aufgabentypen anlegen, z. B. "Reinigung", "Reperaturen" und "Gartenarbeiten".</p>
      <div class="list-group">
        <section v-if="tasktypes.length > 0">
          <article
            v-for="(tasktype, index) in tasktypes"
            class="list-group-item list-group-item-action"
          >
            <h3>
              <font-awesome-icon :icon="['fas', 'tag']"></font-awesome-icon>
              {{ tasktype.name }} ({{ tasktype.tasks_count }})
            </h3>
            <p>Sichtbar für alle</p>
            <router-link
              class="btn btn-success btn-xs"
              style="padding:8px"
              :to="{name: 'tasktypes.update', params: { id: $route.params.id, ttid: tasktype.id } }"
            >
              <span class="glyphicon glyphicon-edit"></span>
            </router-link>
            <button
              @click="showDeleteDialog(index)"
              data-toggle="modal"
              data-target="#deleteModal"
              class="btn btn-danger btn-xs"
              style="padding:8px"
            >
              <span class="glyphicon glyphicon-trash"></span>
            </button>
          </article>
        </section>
        <section class="lead" v-else>
          Es gibt noch keine Aufgabenarten 😢. Du könntest z. B. "Allgemein", "Wartung" und "Sonstiges" als Kategorien eintragen. Möchtest du deinen
          <router-link
            :to="{name: 'tasktypes.new', params: { id: this.$route.params.id } }"
          >erste Aufgabenart anlegen?</router-link>
        </section>
      </div>

      <router-link
        :to="{name: 'tasktypes.new', params: { id: this.$route.params.id } }"
        type="button"
        class="btn btn-plus"
      >
        <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
      </router-link>

      <!-- Modal -->
      <div
        class="modal fade"
        id="deleteModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-body">
              <p>Möchtest du "{{ delete_tasktype.name}}" wirklich löschen?</p>
              <p>Dabei gehen alle zugehörigen Aufgaben verloren.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
              <button @click="deleteTasktype()" type="button" class="btn btn-danger">Löschen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  components: {},
  data() {
    return {
      loading: false,
      delete_tasktype: {
        name: ""
      },
      delete_index: "",

      errors: [],
      tasktypes: [],
      update_tasktype: {}
    };
  },
  created() {
    this.$store.commit("changePage", "Aufgabenarten");
    this.readTasktypes();
  },
  watch: {
    // call again the method if the route changes
    $route: "readTasktypes"
  },

  methods: {
    showDeleteDialog(index) {
      this.delete_tasktype = this.tasktypes[index];
      this.delete_index = index;
      $("#deleteModal").modal("show");
    },

    deleteTasktype() {
      axios
        .delete(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/tasktypes/" +
            this.tasktypes[this.delete_index].id
        )
        .then(response => {
          this.tasktypes.splice(this.delete_index, 1);
          $("#deleteModal").modal("hide");
        })
        .catch(error => {
          console.log(error.response);
        });
    },

    readTasktypes() {
      this.loading = true;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/tasktypes"
        )
        .then(response => {
          this.tasktypes = response.data.tasktypes;
          console.log(response.data);
          this.loading = false;
        })
        .catch(error => {
          console.log(error.data);
        });
    }
  }
};
</script>

<style lang="scss">
.list-group {
  padding-top: 10px;
}
</style>
