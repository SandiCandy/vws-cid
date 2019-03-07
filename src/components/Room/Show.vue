<template>
  <div class="vh-100">
    <div class="loading d-flex justify-content-center" v-if="loading">
      <font-awesome-icon
        :icon="['fas', 'spinner']"
        class="fa-pulse display-4 d-flex justify-content-center"
      ></font-awesome-icon>
    </div>
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
        <section
          class="lead"
          v-else
        >Es gibt noch keine Orte für diesen Bereich 😢. Möchtest du einen
          <router-link
            :to="{name: 'rooms.new', params: { id: this.$route.params.id } }"
          >Bereich anlegen?</router-link>
        </section>
      </div>

      <router-link
        :to="{name: 'rooms.new', params: { id: this.$route.params.id } }"
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
//import Newroom from "./New.vue";
export default {
  components: {
    //Newroom
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
  mounted() {
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
          "http://localhost:8000/api/auth/roomtype/" +
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
      this.loading = true;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get(
          "http://localhost:8000/api/auth/roomtype/" +
            this.$route.params.id +
            "/rooms"
        )
        .then(response => {
          this.rooms = response.data.rooms;
          console.log(response.data);
          this.loading = false;
        })
        .catch(error => {
          console.log(error.data);
        });
    },

    fetchRoomtype() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");

      axios
        .get(
          "http://localhost:8000/api/auth/group/roomtypes/" +
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
