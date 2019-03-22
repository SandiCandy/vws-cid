<template>
  <div>
    <div class="vh-100">
      <loading class="loading" v-if="$store.getters.loading"></loading>
      <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
      <div class="content" v-else>
        <div class="list-group">
          <section v-if="team.length > 0">
            <article v-for="(user, index) in team" class="list-group-item list-group-item-action">
              <h3>
                {{ user.name }}
                <font-awesome-icon :icon="['fas', 'star']"></font-awesome-icon>
              </h3>
              <p>bla bla</p>
              <router-link
                class="btn btn-success btn-xs"
                style="padding:8px"
                :to="{name: 'team.update', params: { id: $route.params.id, tid: user.id } }"
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
          <div v-if="team.length == 1">
            <no-member routename="group.add"></no-member>
          </div>
        </div>

        <add-button routename="group.add"></add-button>

        <div
          class="modal fade"
          id="deleteModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-hidden="true"
        >
          <delete-user-modal v-bind:user="delete_user" v-on:userDeleted="removeDeletedUser"></delete-user-modal>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import Loading from "../common/Loading.vue";
import AddButton from "../common/AddButton.vue";
import NoMember from "./TeamComponents/NoMember.vue";
import DeleteUserModal from "./TeamComponents/DeleteUserModal.vue";
export default {
  components: {
    Loading,
    NoMember,
    AddButton,
    DeleteUserModal
  },
  data() {
    return {
      loading: false,
      delete_user: {},
      delete_index: "",

      error: {},
      errors: [],
      team: []
    };
  },

  created() {
    this.readTeam();
    this.$store.commit("changePage", "Team");
  },

  methods: {
    showDeleteDialog(index) {
      this.delete_user = this.team[index];
      this.delete_index = index;
      $("#deleteModal").modal("show");
    },
    removeDeletedUser(index) {
      console.log("remove");
      this.team.splice(this.delete_index, 1);
    },

    readTeam() {
      this.$store.commit("isLoading", true);
      this.error = null;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          process.env.ROOT_API + "/auth/group/" +
            this.$route.params.id +
            "/team"
        )
        .then(response => {
          this.team = response.data.team;
          console.log(response.data);
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
          console.log(error.response);
        });
    }
  }
};
</script>