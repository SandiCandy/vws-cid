<template>
  <transition name="fade">
    <div class="media row" :class="'prio-' + task.priority" v-if="show">
      <div class="img col-xs-2">
        <task-image :images="task.images" :priority="task.priority"></task-image>
      </div>
      <div class="media-body col-xs-10">
        <router-link :to="{name: 'tasks.update', params: { id: $route.params.id, tid: task.id } }">
          <p>
            {{ moment(task.startet_at).format('lll')}}
            <span
              v-if="task.deadline_at"
            >- {{ moment(task.deadline_at).format('lll')}}</span>
          </p>
          <h3 class="mt-0">
            <span v-if="task.room && task.room.name">{{task.room.name}}</span>
            {{ task.title }}
          </h3>
          <p>{{task.description}}</p>
        </router-link>

        <p v-if="task.is_done">
          Erledigt
          <span v-if="task.completed_at">am {{ moment(task.completed_at).format('LL') }}</span>
          <span v-if="task.editor">von {{ task.editor.name}}</span>
        </p>
      </div>

      <task-done-button @click.native="isDone(index)" v-if="!task.is_done"></task-done-button>
    </div>
  </transition>
</template>

<script>
import TaskImage from "./TaskListComponents/TaskImage.vue";
import TaskDoneButton from "./TaskListComponents/TaskDoneButton.vue";
export default {
  components: {
    TaskDoneButton,
    TaskImage
  },
  data() {
    return {
      show: true
    };
  },
  props: {
    task: Object,
    index: Number
  },
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
    emitDone() {
      this.$emit("done", this.index);
    }
  }
};
</script>

<style lang="scss" scoped>
.media-body {
  word-break: break-word;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  & h3 {
    color: $highlight-color;
  }
}
</style>