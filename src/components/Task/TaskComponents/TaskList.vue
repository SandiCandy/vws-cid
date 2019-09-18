<template>
  <div>
    <section v-if="tasks.length > 0" class="main-sec">
      <h1 class="display-1">{{title}}</h1>
      <article v-for="(task, index) in tasks" :key="task.id">
        <task-item :task="task" :index="index"></task-item>
        <hr />
      </article>
    </section>
    <no-tasks v-else></no-tasks>
  </div>
</template>

<script>
import TaskItem from "./TaskItem.vue";
import NoTasks from "./NoTasks.vue";
export default {
  components: {
    TaskItem,
    NoTasks
  },
  props: {
    title: String,
    tasks: Array
  }
};
</script>

<style lang="scss" scoped>
</style>



