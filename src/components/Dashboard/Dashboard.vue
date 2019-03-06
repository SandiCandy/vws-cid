<template>
  <div class="vh-100">
    <div class="panel-heading">
      <p>Hallo {{user.name}}</p>
    </div>
    <div class="panel-body">
      <section>
        <h1>Deine Gruppen</h1>
        <router-link
          type="button"
          class="btn btn-info btn-block btn-group"
          v-for="group in groups"
          :key="group.id"
          :to="{ name: 'group', params: {id: group.id} }"
          v-bind:class="group.name"
        >{{group.name}} ({{group.pivot.role}})</router-link>
        <button type="button" class="btn btn-success btn-block btn-new-group">Neue Gruppe anlegen</button>
      </section>
      <router-link :to="{name: '' }" type="button" class="btn btn-plus">
        <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
      </router-link>
    </div>
  </div>
</template>



<script>
export default {
  components: {},
  data() {
    return {
      groups: [],
      user: {
        name: ""
      }
    };
  },

  mounted() {
    this.findGroups();
    this.getName();
    this.$store.commit("changePage", "Dashboard");
  },

  methods: {
    getName() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios.get("http://localhost:8000/api/auth/user").then(response => {
        this.user = response.data;
      });
    },
    findGroups() {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios.get("http://localhost:8000/api/auth/mygroups").then(response => {
        this.groups = response.data.groups;
        console.log(this.groups);
      });
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