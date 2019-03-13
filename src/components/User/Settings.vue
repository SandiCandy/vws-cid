<template>
  <div>
    <div class="vh-100">
      <loading class="loading" v-if="$store.getters.loading"></loading>
      <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
      <div class="content" v-else>
        <div class="list-group list-group-flush text-center">
          <section @click="changeNameDialog()" class="list-group-item">
            <p>Namen ändern</p>
            <p class="text-tudu-blu">{{user.name}}</p>
          </section>
          <section @click="openMailDialog()" class="list-group-item">
            <p>E-mailadresse ändern</p>
            <p class="text-tudu-blu">{{user.email}}</p>
          </section>
          <section class="list-group-item">E-mailadresse ändern</section>
          <section class="list-group-item">Passwort ändern</section>
          <section class="list-group-item text-danger">Benutzerkonto löschen</section>
        </div>

        <div
          class="modal fade"
          id="changeNameModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="changeModalLabel"
          aria-hidden="true"
        >
          <change-name-modal v-bind:setting="user.name" v-on:changed="update"></change-name-modal>
        </div>

        <div
          class="modal fade"
          id="changeMailModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="changeModalLabel"
          aria-hidden="true"
        >
          <change-mail-modal v-bind:setting="user.email" v-on:changed="update"></change-mail-modal>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import Loading from "../common/Loading.vue";
import ChangeNameModal from "./Components/ChangeNameModal.vue";
import ChangeMailModal from "./Components/ChangeMailModal.vue";
export default {
  components: {
    Loading,
    ChangeNameModal,
    ChangeMailModal
  },
  data() {
    return {
      change_setting: "",
      delete_index: "",

      error: {},
      errors: [],
      user: {}
    };
  },

  created() {
    this.fetchAccountData();
    this.$store.commit("changePage", "Meine Einstellungen");
  },

  methods: {
    changeNameDialog() {
      this.change_setting = this.user.name;
      $("#changeNameModal").modal("show");
    },
    openMailDialog() {
      this.change_setting = this.user.email;
      $("#changeMailModal").modal("show");
    },
    update(changedUser) {
      this.user = changedUser;
    },

    fetchAccountData() {
      this.$store.commit("isLoading", true);
      this.error = null;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get("http://localhost:8000/api/auth/settings")
        .then(response => {
          this.user = response.data;
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