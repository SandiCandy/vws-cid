<template>
  <div>
    <div class="vh-100">
      <loading class="loading" v-if="$store.getters.loading"></loading>
      <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
      <div class="content" v-else>
        <div class="list-group list-group-flush text-center">
          <section @click="changeNameDialog()" class="list-group-item">
            <p>Gruppenname</p>
            <p class="text-tudu-blu">{{group.name}}</p>
          </section>
          <section @click="openApikeyDialog()" class="list-group-item">
            <p>API-Key</p>
            <p class="text-tudu-blu">{{ group.apikey}}</p>
          </section>
          <section
            @click="openDeleteDialog()"
            class="list-group-item text-danger"
          >Benutzerkonto löschen</section>
        </div>

        <div
          class="modal fade"
          id="changeNameModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="changeModalLabel"
          aria-hidden="true"
        >
          <change-name-modal v-bind:setting="group.name" v-on:changed="update"></change-name-modal>
        </div>

        <div
          class="modal fade"
          id="changeApikeyModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="changeModalLabel"
          aria-hidden="true"
        >
          <change-apikey-modal v-bind:setting="group.apikey" v-on:changed="update"></change-apikey-modal>
        </div>

        <div
          class="modal fade"
          id="deleteModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-hidden="true"
        >
          <delete-modal v-bind:group="group"></delete-modal>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import Loading from "../common/Loading.vue";
import ChangeNameModal from "./Components/ChangeNameModal.vue";
import ChangeApikeyModal from "./Components/ChangeApikey.vue";
import DeleteModal from "./Components/DeleteModal.vue";
export default {
  components: {
    Loading,
    ChangeNameModal,
    ChangeApikeyModal,
    DeleteModal
  },
  data() {
    return {
      change_setting: "",
      delete_index: "",

      error: {},
      errors: [],
      group: {}
    };
  },

  created() {
    this.fetchGroupData();
    this.$store.commit("changePage", "Meine Einstellungen");
  },

  methods: {
    changeNameDialog() {
      this.change_setting = this.group.name;
      $("#changeNameModal").modal("show");
    },
    openApikeyDialog() {
      this.change_setting = this.group.apikey;
      $("#changeApikeyModal").modal("show");
    },
    openDeleteDialog() {
      $("#deleteModal").modal("show");
    },
    update(changedData) {
      this.group = changedData;
    },

    fetchGroupData() {
      this.$store.commit("isLoading", true);
      this.error = null;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get("http://localhost:8000/api/auth/group/" + this.$route.params.id)
        .then(response => {
          this.group = response.data.group;
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