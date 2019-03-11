<template>
  <div class="vh-100">
    <loading class="loading" v-if="$store.getters.loading"></loading>
    <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
    <div class="content" v-else>
      <div class="list-group">
        <section v-if="roomtypes.length > 0">
          <article
            v-for="(roomtype, index) in roomtypes"
            class="list-group-item list-group-item-action"
          >
            <router-link :to="{name: 'rooms.show', params: { id: roomtype.id } }">
              <h3>
                <font-awesome-icon :icon="['fas', 'home']"></font-awesome-icon>
                {{ roomtype.name }} ({{ roomtype.rooms_count }})
              </h3>
              <p>Bla bla</p>
            </router-link>

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
        <div v-else>
          <no-content contenttype="Bereiche" routename="roomtypes.new"></no-content>
        </div>
      </div>

      <add-button routename="roomtypes.new"></add-button>

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
      this.$store.commit("isLoading", true);
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
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
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
