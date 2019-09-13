<template>
  <transition name="fade">
    <div class="media row" :class="'prio-' + task.priority" v-if="show">
      <div class="img col-xs-2">
        <img
          :src="backend_url + '/storage/' + task.images[0].name"
          :class="'prio-' + task.priority"
          v-if="task.images.length > 0"
          height="45"
        />
        <div class="arrow-right"></div>
      </div>
      <div class="media-body col-xs-10">
        <router-link :to="{name: 'tasks.update', params: { id: $route.params.id, tid: task.id } }">
          <p v-if="task.deadline_at">{{ moment(task.deadline_at).format('lll')}}</p>
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
    emitDone() {
      this.$emit("done", this.index);
    }
  }
};
</script>

<style lang="scss" scoped>
.arrow-right {
  background-color: #444;
  height: 40px;
  left: -20px;
  position: absolute;
  top: -20px;
  width: 40px;

  -webkit-transform: rotate(-45deg);
}

div.img {
  overflow: hidden;
  position: relative;
  margin-right: 1rem;
  background-color: $highlight-color;
  width: 45px;
  height: 45px;
}

.media-body {
  word-break: break-word;
}

.prio-0 .arrow-right {
  background-color: $green;
}

.prio-5 .arrow-right {
  background-color: $yellow;
}

.prio-10 .arrow-right {
  background-color: $red;
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
    color: $highlight-color;
  }
}
</style>