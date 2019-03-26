<template>
  <div class="vh-100">
    <loading class="loading" v-if="$store.getters.loading"></loading>
    <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
    <div class="content" v-else>
      <p>Über unsere Anbindung zu Camping.care kannst du ganz einfach deine Tuudu-Liste mit deinem Buchungssystem verbinden.</p>
      <div class="list-group list-group-flush text-center">
        <section @click="openApikeyDialog()" class="list-group-item">
          <p>Mit Camping.care verbinden</p>
          <p class="text-tudu-blu">{{ group.apikey}}</p>
        </section>
        <section class="list-group-item">
          <router-link
            :to="{name: 'tasktypes.show', params: { id: this.$route.params.id} }"
          >Meine Aufgabenarten</router-link>
        </section>
        <section
          @click="importDatafromCampingcare()"
          class="list-group-item text-danger"
        >Daten importieren</section>
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
    </div>
  </div>
</template>



<script>
import Loading from "../common/Loading.vue";
import ChangeApikeyModal from "./Components/ChangeApikey.vue";
export default {
  components: {
    Loading,
    ChangeApikeyModal
  },
  data() {
    return {
      change_setting: "",
      delete_index: "",

      error: {},
      errors: [],
      group: {},
      roomtypes: []
    };
  },

  created() {
    this.fetchGroupData();
    this.$store.commit("changePage", "Camping.care");
  },

  methods: {
    openApikeyDialog() {
      this.change_setting = this.group.apikey;
      $("#changeApikeyModal").modal("show");
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
        .get(process.env.ROOT_API + "/auth/group/" + this.$route.params.id)
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
    },

    importDatafromCampingcare() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/campingcare"
        )
        .then(response => {
          this.roomtypes = response.data.roomtypes;
          console.log(response.data);
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          console.log(error, "error");
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
          console.log(error.response);
        });
    }
  }
};
</script>