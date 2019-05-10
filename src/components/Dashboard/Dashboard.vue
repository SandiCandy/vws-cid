<template>
  <div class="min-h-100">
    <loading class="loading container" v-if="$store.getters.loading"></loading>
    <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
    <div class="content container" v-else>
      <div class="panel-heading">
        <p>Hallo {{user.name}}</p>
      </div>
      <div class="panel-body">
        <section>
          <h1>Deine Gruppen</h1>
          <section v-if="groups.length > 0">
            <router-link
              type="button"
              class="btn btn-info btn-block btn-group"
              v-for="group in groups"
              :key="group.id"
              :to="{ name: 'groups', params: {id: group.id} }"
              v-bind:class="group.name"
            >{{group.name}} ({{group.pivot.role}})</router-link>
          </section>
          <section v-else>
            <no-content contenttype="Gruppen" routename="groups.new"></no-content>
          </section>
        </section>
        <router-link :to="{name: 'groups.new' }" type="button" class="btn btn-plus">
          <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
        </router-link>
      </div>
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="invitationModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="invitationModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <h3 class="h4 modal-title">Einladung erhalten</h3>
          <div class="modal-body" v-if="invitations.length > 0">
            <p></p>
            <p>Du wurdest in die Gruppe "{{ invitations[0].name}}" eingeladen. Möchtest du Mitglied werden?</p>
          </div>
          <div class="modal-footer">
            <button @click="denyInvitation()" class="btn text-danger" data-dismiss="modal">Ablehnen</button>
            <button @click="acceptInvitation()" type="button" class="btn btn-success">Akzeptieren</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import Loading from "../common/Loading.vue";
import NoContent from "../common/NoContent.vue";
export default {
  components: {
    Loading,
    NoContent
  },
  data() {
    return {
      groups: [],
      user: {
        name: ""
      },
      invitations: [],
      error: {}
    };
  },

  created() {
    this.findGroups();
    this.getName();
    this.readInvitations();
    this.$store.commit("changePage", "Dashboard");
  },

  methods: {
    getName() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(process.env.ROOT_API + "/auth/user" + process.env.VERSION)
        .then(response => {
          this.user = response.data;
        });
    },
    findGroups() {
      this.$store.commit("isLoading", true);
      this.error = null;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(process.env.ROOT_API + "/auth/mygroups" + process.env.VERSION)
        .then(response => {
          this.$store.commit("isLoading", false);
          this.groups = response.data.groups;
        })
        .catch(error => {
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
        });
    },
    readInvitations() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(process.env.ROOT_API + "/auth/myinvitations" + process.env.VERSION)
        .then(response => {
          this.invitations = response.data.invitations;
          this.showInvitationIfExist();
          console.log(response.data);
        })
        .catch(error => {
          console.log("bla", error);
        });
    },
    acceptInvitation() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          process.env.ROOT_API +
            "/auth/invitation/" +
            this.invitations[0].id +
            process.env.VERSION
        )
        .then(response => {
          this.invitations.splice(0, 1);
          this.showInvitationIfExist();
          console.log("response", response.data);
          this.findGroups();
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    denyInvitation() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .delete(
          process.env.ROOT_API +
            "/auth/invitation/" +
            this.invitations[0].id +
            process.env.VERSION
        )
        .then(response => {
          this.invitations.splice(0, 1);
          this.showInvitationIfExist();
          console.log("response", response.data);
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    showInvitationIfExist() {
      if (this.invitations.length > 0) {
        $("#invitationModal").modal("show");
      } else {
        $("#invitationModal").modal("hide");
      }
    }
  }
};
</script>

<style lang="scss">
button.btn-group {
  margin: 2px 0;
}
button.btn-new-group {
  margin: 5px 0;
}
</style>