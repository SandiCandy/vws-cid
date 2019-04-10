<template>
  <div>
    <div class="task-list">
      <loading class="loading" v-if="$store.getters.loading"></loading>
      <div class="error" v-else-if="$store.getters.error">{{ $store.getters.error }}</div>
      <div class="content col-sm-12" v-else>
        <section v-if="tasktemplates.length > 0">
          <article v-for="(tasktemplate, index) in tasktemplates" :key="tasktemplate.id">
            <tasktemplate-item
              :tasktemplate="tasktemplate"
              :index="index"
              v-on:done="spliceArray"
              v-on:deletemodal="fetchTasktemplate"
            ></tasktemplate-item>
            <hr>
          </article>
        </section>
        <div v-else>
          <no-content contenttype="wiederholende Aufgaben" routename="tasktemplates.new"></no-content>
        </div>

        <add-button routename="tasktemplates.new"></add-button>

        <div
          class="modal fade"
          id="deleteModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-hidden="true"
        >
          <delete-tasktemplate-modal
            v-bind:tasktemplate="delete_tasktemplate"
            v-on:tasktemplateDeleted="removeDeletedTasktemplate"
          ></delete-tasktemplate-modal>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import Loading from "../common/Loading.vue";
import NoContent from "../common/NoContent.vue";
import AddButton from "../common/AddButton.vue";
import TasktemplateItem from "./Components/TasktemplateItem.vue";
import DeleteTasktemplateModal from "./Components/DeleteTasktemplateModal.vue";
export default {
  components: {
    Loading,
    NoContent,
    AddButton,
    TasktemplateItem,
    DeleteTasktemplateModal
  },
  data() {
    return {
      error: null,
      delete_tasktemplate: {},
      delete_index: "",
      errors: [],
      tasktemplates: []
    };
  },

  created() {
    this.fetchTasktemplates();
    this.$store.commit("changePage", "Wiederholende Aufgaben");
  },

  methods: {
    spliceArray(index) {
      this.tasktemplates.splice(index, 1);
    },
    fetchTasktemplate(index) {
      this.delete_tasktemplate = this.tasktemplates[index];
      this.delete_index = index;
      $("#deleteModal").modal("show");
    },
    removeDeletedTasktemplate(index) {
      console.log("remove");
      this.tasktemplates.splice(this.delete_index, 1);
    },

    fetchTasktemplates() {
      this.$store.commit("isLoading", true);
      this.error = null;

      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/tasktemplates"
        )
        .then(response => {
          this.tasktemplates = response.data.tasktemplates;
          console.log(response.data);
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          console.log(error.response);

          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
        });
    }
  }
};
</script>

<style lang="scss">
.vdp-datepicker {
  color: black;
}
</style>


