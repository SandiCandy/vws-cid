<template>
  <div class="media" :class="'prio-' + tasktemplate.priority">
    <div class="media-body">
      <p>Erstellt am {{ moment(tasktemplate.created_at).format('LL') }}</p>
      <h3 class="mt-0">{{ tasktemplate.title }}</h3>
      <p>{{tasktemplate.description}}</p>

      <router-link
        class="btn btn-success btn-xs"
        style="padding:8px"
        :to="{name: 'tasktemplates.update', params: { id: $route.params.id, tid: tasktemplate.id } }"
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
    </div>
  </div>
</template>

<script>
export default {
  props: ["tasktemplate", "index"],
  methods: {
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