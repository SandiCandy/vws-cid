<template>
  <div class="card" v-if="task">
    <div class="card-body">
      <p>
        <strong>{{task.tasktype.name}}</strong>
      </p>
      <h3 class="card-title">{{task.title}}</h3>
      <div class="card-text">
        <p>
          <small
            class="text-muted"
          >{{ moment(task.created_at).format('LL') }} von {{ task.creator.name}}</small>
        </p>
        <p>{{task.description}}</p>

        <p v-if="room && room.roomtype">
          <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="mr-3"></font-awesome-icon>
          {{room.roomtype.name }} / {{room.name}}
        </p>
      </div>
      <img
        :src="'http://localhost:8000/storage/' + task.images[0].name"
        class="card-img-top"
        alt="..."
        v-if="task.images && task.images.length > 0"
      >
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      task: null,
      error: null,
      room: {}
    };
  },
  created() {
    this.fetchTask();
    this.$store.commit("changePage", "toooodoooo");
  },
  methods: {
    fetchTask() {
      this.$store.commit("isLoading", true);
      this.error = null;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + $cookies.get("token");
      axios
        .get("http://localhost:8000/api/auth/tasks/" + this.$route.params.tid)
        .then(response => {
          this.task = response.data.task;
          this.room = response.data.room[0];
          console.log(response.data);
          this.$store.commit("isLoading", false);
        })
        .catch(error => {
          this.$store.commit("hasError", error.toString());
          this.$store.commit("isLoading", false);
        });
    }
  }
};
</script>
