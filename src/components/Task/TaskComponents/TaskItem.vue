<template>
  <transition name="fade">
    <div class="media row" :class="'prio-' + task.priority" v-if="show">
      <div class="img col-xs-2">
        <img
          :src="backend_url + '/storage/' + task.images[0].name"
          :class="'prio-' + task.priority"
          v-if="task.images.length > 0"
          width="45"
          height="45"
        >
        <div class="no-image" v-else></div>
      </div>
      <div class="media-body col-xs-10">
        <router-link :to="{name: 'tasks.show', params: { id: $route.params.id, tid: task.id }}">
          <p
            v-if="task.creator"
          >{{ moment(task.created_at).format('LL') }}&nbsp;von {{ task.creator.name}}</p>
          <p v-else>{{ moment(task.startet_at).format('LL')}}</p>
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

      <button
        @click="isDone(index)"
        type="button"
        class="col-xs-2 checkbox is-done"
        v-if="task.is_done != 1"
      >
        <font-awesome-icon :icon="['fas', 'check']" class="checkbox"></font-awesome-icon>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      backend_url: process.env.ROOT,
      show: true
    };
  },
  props: ["task", "index"],
  methods: {
    isDone() {
      this.show = false;
      axios
        .patch(
          process.env.ROOT_API + "/auth/tasks/" + this.task.id + "/finished"
        )
        .then(response => {
          setTimeout(this.emitDone, 700);
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    showDeleteDialog(index) {
      this.$emit("deletemodal", this.index);
    },
    emitDone() {
      this.$emit("done", this.index);
    }
  }
};
</script>

<style lang="scss" scoped>
div.img,
button.is-done {
  box-sizing: border-box;
  padding: 5px;
}
div.no-image {
  background-color: #39d8d8;
  border-style: solid;
  border-width: 45px 45px 0px 0px;
  border-color: green transparent transparent transparent;
}

.media-body {
  word-break: break-word;
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

button.is-done {
  background: transparent;
  border: inherit;
  position: relative;
  right: 5px;
}

svg.checkbox {
  border: 2px solid #b4b4b4;
  color: #dddddd;
  height: 45px;
  width: 45px;
  padding: 0px 2px;

  &:active {
    color: green;
    border-color: green;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  & h3 {
    color: #39d8d8;
  }
}
</style>