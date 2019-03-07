<template>
  <div class="row">
    <router-link
      :to="{name: 'tasks', params: { id: this.$route.params.id } }"
      type="button"
      class="btn btn-default tudu-blu btn-action btn-12"
    >
      <span>Aktuelles</span>
    </router-link>

    <router-link
      :to="{name: '', params: { id: this.$route.params.id } }"
      type="button"
      class="btn btn-default tudu-blu btn-action btn-6"
    >
      <span>Historie</span>
    </router-link>

    <router-link
      :to="{name: '', params: { id: this.$route.params.id } }"
      type="button"
      class="btn btn-default tudu-blu btn-action btn-6"
    >
      <span>Wiederholungen</span>
    </router-link>

    <router-link
      :to="{name: '', params: { id: this.$route.params.id}}"
      type="button"
      class="btn btn-default tudu-blu btn-action btn-6"
    >
      <span>Team</span>
    </router-link>

    <router-link
      :to="{name: 'roomtypes.show', params: { id: this.$route.params.id}}"
      type="button"
      class="btn btn-default tudu-blu btn-action btn-6"
    >
      <span>Orte</span>
    </router-link>

    <router-link
      :to="{name: 'tasks.new', params: { id: this.$route.params.id} }"
      type="button"
      class="btn btn-default tudu-blu-outline btn-action btn-12"
    >
      <span>Neue Aufgabe anlegen</span>
    </router-link>
  </div>
</template>



<script>
export default {
  components: {},
  data() {
    return {
      group: {},
      user: {
        name: ""
      }
    };
  },

  mounted() {
    this.getGroup();
  },

  methods: {
    getGroup() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get("http://localhost:8000/api/auth/group/" + this.$route.params.id)
        .then(response => {
          this.group = response.data.group;
          console.log(this.group);
          this.$store.commit("changePage", this.group.name);
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>

<style lang="scss">
.btn.btn-action {
  height: 75px;
  border-radius: 0.1rem;
  line-height: 70px;
  & span {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
  }
}

.btn-12 {
  width: calc(100vw - 10px);
  margin: 5px 5px 2px 5px;
}

.btn-6:nth-child(even) {
  margin: 3px 2px 2px 5px;
}

.btn-6:nth-child(odd) {
  margin: 3px 5px 2px 2px;
}

.btn.btn-6 {
  width: calc(50vw - 7px);
}
</style>