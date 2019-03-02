<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3>
              <span class="glyphicon glyphicon-dashboard"></span> Dashboard
            </h3>
            <section>
              <h1>Meine Gruppen</h1>
              <p v-for="group in groups">{{group.name}} {{group.pivot.role}}</p>
            </section>
            <section>
              <h1>Aktuelle Aufgaben</h1>
            </section>
            <div class="panel-body"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  components: {},
  data() {
    return {
      groups: []
    };
  },

  mounted() {
    this.findGroups();
  },

  methods: {
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