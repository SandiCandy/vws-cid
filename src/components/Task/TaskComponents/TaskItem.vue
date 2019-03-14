<template>
  <div class="media" :class="'prio-' + task.priority">
    <img
      :src="'http://localhost:8000/storage/' + task.images[0].name"
      class="mr-3"
      :class="'prio-' + task.priority"
      height="64"
      width="64"
      v-if="task.images.length > 0"
    >
    <div class="no-image mr-3" v-else></div>
    <div class="media-body">
      <router-link :to="{name: 'tasks.show', params: { id: $route.params.id, tid: task.id }}">
        <p>{{ moment(task.created_at).format('LL') }} von {{ task.creator.name}}</p>
        <h3 class="mt-0">{{ task.title }}</h3>
        <p>{{task.description}}</p>
      </router-link>

      <router-link
        class="btn btn-success btn-xs"
        style="padding:8px"
        :to="{name: 'tasks.update', params: { id: $route.params.id, tid: task.id } }"
      >
        <span class="glyphicon glyphicon-edit"></span>
      </router-link>
      <button
        @click="showDeleteDialog(index)"
        data-toggle="modal"
        data-target="#deleteModal"
        class="btn btn-danger btn-xs"
        style="padding:8px"
      >
        <span class="glyphicon glyphicon-trash"></span>
      </button>
      <p v-if="task.is_done">
        Erledigt
        <span v-if="task.completed_at">am {{ moment(task.completed_at).format('LL') }}</span>
        <span v-if="task.editor">von {{ task.editor.name}}</span>
      </p>
    </div>

    <button @click="isDone(index)" type="button" class="ml-3 checkbox" v-if="task.is_done != 1">
      <font-awesome-icon :icon="['fas', 'check']" class="checkbox"></font-awesome-icon>
    </button>
  </div>
</template>

<script>
export default {
  props: ["task", "index"],
  methods: {
    isDone() {
      axios
        .patch(
          "http://localhost:8000/api/auth/tasks/" + this.task.id + "/finished"
        )
        .then(response => {
          //this.tasks.splice(this.index, 1);
          this.$emit("done", this.index);
          console.log("Task finished");
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    showDeleteDialog(index) {
      this.$emit("deletemodal", this.index);
    }
  }
};
</script>

<style lang="scss" scoped>
div.no-image {
  width: 64px;
  height: 64px;
  background-color: #39d8d8;
  border-style: solid;
  border-width: 64px 64px 0px 0px;
  border-color: green transparent transparent transparent;
}

.prio-0 .no-image {
  border-color: green transparent transparent transparent;
}

.prio-5 .no-image {
  border-color: yellow transparent transparent transparent;
}

.prio-10 .no-image {
  border-color: red transparent transparent transparent;
}

svg.checkbox {
  border: 4px solid #b4b4b4;
  color: #b4b4b4;
  height: 50px;
  width: 50px;
  padding: 0px 2px;
  font-size: 3rem;

  &:active {
    color: green;
    border-color: green;
  }
}
</style>