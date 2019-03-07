<template>
  <div class="vh-100">
    <div class="loading d-flex justify-content-center" v-if="loading">
      <font-awesome-icon :icon="['fas', 'spinner']" class="display-4 d-flex justify-content-center"></font-awesome-icon>
    </div>
    <div class="content" v-else>
      <div class="list-group">
        <section v-if="roomtypes.length > 0">
          <article
            v-for="(roomtype, index) in roomtypes"
            class="list-group-item list-group-item-action"
          >
            <h3>
              <font-awesome-icon :icon="['fas', 'home']"></font-awesome-icon>
              {{ roomtype.name }} ({{ roomtype.rooms_count }})
            </h3>
            <p>Bla bla</p>
            <router-link
              class="btn btn-success btn-xs"
              style="padding:8px"
              :to="{name: 'roomtypes.update', params: { id: $route.params.id, rtid: roomtype.id } }"
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
        <section class="lead" v-else>Es gibt noch keine Bereiche 😢. Möchtest du einen
          <router-link
            :to="{name: 'roomtypes.new', params: { id: this.$route.params.id } }"
          >Bereich anlegen?</router-link>
        </section>
      </div>

      <router-link
        :to="{name: 'roomtypes.new', params: { id: this.$route.params.id } }"
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
              <p>Möchtest du "{{ delete_roomtype.name}}" wirklich löschen?</p>
              <p>Dabei gehen alle zugehörigen Aufgaben verloren.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
              <button @click="deleteroom()" type="button" class="btn btn-danger">Löschen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
//import Newroomtype from "./New.vue";
export default {
  components: {
    //Newroomtype
  },
  data() {
    return {
      loading: false,
      delete_roomtype: {
        name: ""
      },
      delete_index: "",

      errors: [],
      roomtypes: []
    };
  },
  mounted() {
    this.$store.commit("changePage", "Bereiche");
    this.fetchRoomtypes();
  },

  methods: {
    showDeleteDialog(index) {
      console.log(this.roomtypes[index], index);
      this.delete_roomtype = this.roomtypes[index];
      this.delete_index = index;
      $("#deleteModal").modal("show");
    },

    deleteroom() {
      axios
        .delete(
          "http://localhost:8000/api/auth/group/" +
            this.$route.params.id +
            "/roomtypes/" +
            this.roomtypes[this.delete_index].id
        )
        .then(response => {
          this.roomtypes.splice(this.delete_index, 1);
          $("#deleteModal").modal("hide");
        })
        .catch(error => {
          console.log(error.response);
        });
    },

    fetchRoomtypes() {
      this.loading = true;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get(
          "http://localhost:8000/api/auth/group/" +
            this.$route.params.id +
            "/roomtypes"
        )
        .then(response => {
          this.roomtypes = response.data.roomtypes;
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
