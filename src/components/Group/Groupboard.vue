<template>
  <div class="row flex-container">
    <div class="col-12 text-right primary--text">
      <router-link
        :to="{name: 'groups.settings', params: { id: this.$route.params.id } }"
        class="mr-2"
      >Einstellungen</router-link>
    </div>
    <router-link
      :to="{name: 'tasks.current', params: { id: this.$route.params.id } }"
      type="button"
      class="btn btn-default tudu-blu btn-action btn-12"
    >
      <span>Aktuelles</span>
    </router-link>

    <router-link
      :to="{name: 'tasks.finished', params: { id: this.$route.params.id } }"
      type="button"
      class="btn btn-default tudu-blu btn-action btn-6"
    >
      <span>Historie</span>
    </router-link>

    <router-link
      :to="{name: 'tasktemplates.show', params: { id: this.$route.params.id } }"
      type="button"
      class="btn btn-default tudu-blu btn-action btn-6"
    >
      <span>Wiederholungen</span>
    </router-link>

    <router-link
      :to="{name: 'group.team', params: { id: this.$route.params.id}}"
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
        .get(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            process.env.VERSION
        )
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
  height: 90px;
  border-radius: 0.1rem;
  line-height: 80px;
  & span {
    display: inline-block;
    vertical-align: middle;
  }
}

.btn-12 {
  //width: calc(100vw - 10px);
  margin: 5px 5px 3px 5px;
  flex: 0 1 calc(90% + 6px);
}

.btn-6:nth-child(even) {
  margin: 3px 5px 3px 3px;
}

.btn-6:nth-child(odd) {
  margin: 3px 3px 3px 5px;
}

.btn.btn-6 {
  //width: calc(50vw - 8px);

  flex: 0 1 45%;
}

.flex-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: space-around;
  align-items: center;
}
</style>