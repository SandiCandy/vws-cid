<template>
  <div class="vh-100">
    <loading class="loading" v-if="$store.getters.loading"></loading>
    <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
    <div class="content" v-else>
      <div class="list-group">
        <section v-if="rooms.length > 0">
          <article v-for="(room, index) in rooms" class="list-group-item list-group-item-action">
            <h3>
              <font-awesome-icon :icon="['fas', 'home']"></font-awesome-icon>
              {{ room.name }}
            </h3>
            <p>Bla bla</p>
            <router-link
              class="btn btn-success btn-xs"
              style="padding:8px"
              :to="{name: 'rooms.update', params: { id: $route.params.id, rid: room.id } }"
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
        <div v-else>
          <no-content contenttype="Orte in diesem Bereich" routename="rooms.new"></no-content>
        </div>
      </div>

      <add-button routename="rooms.new"></add-button>

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
              <p>Möchtest du "{{ delete_room.name}}" wirklich löschen?</p>
              <p>Dabei gehen alle zugehörigen Aufgaben verloren.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
              <button @click="deleteRoom()" type="button" class="btn btn-danger">Löschen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import Loading from "../common/Loading.vue";
import NoContent from "../common/NoContent.vue";
import AddButton from "../common/AddButton.vue";
export default {
  components: {
    Loading,
    NoContent,
    AddButton
  },
  data() {
    return {
      loading: false,
      roomtype: {},
      delete_room: {
        name: ""
      },
      delete_index: "",

      errors: [],
      rooms: []
    };
  },
  created() {
    this.fetchRooms();
    this.fetchRoomtype();
  },

  methods: {
    showDeleteDialog(index) {
      console.log(this.rooms[index], index);
      this.delete_room = this.rooms[index];
      this.delete_index = index;
      $("#deleteModal").modal("show");
    },

    deleteRoom() {
      axios
        .delete(
          process.env.ROOT_API + "/auth/roomtype/" +
            this.$route.params.id +
            "/rooms/" +
            this.rooms[this.delete_index].id
        )
        .then(response => {
          this.rooms.splice(this.delete_index, 1);
          $("#deleteModal").modal("hide");
        })
        .catch(error => {
          console.log(error.response);
        });
    },

    fetchRooms() {
      this.$store.commit("isLoading", true);
      this.error = null;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get(
          process.env.ROOT_API + "/auth/roomtype/" +
            this.$route.params.id +
            "/rooms"
        )
        .then(response => {
          this.rooms = response.data.rooms;
          console.log(response.data);
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
        });
    },

    fetchRoomtype() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get(
          process.env.ROOT_API + "/auth/group/roomtypes/" +
            this.$route.params.id
        )
        .then(response => {
          this.roomtype = response.data.roomtype;
          console.log(response.data);
          this.$store.commit("changePage", this.roomtype.name);
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
