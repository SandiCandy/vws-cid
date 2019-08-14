<template>
  <div class="media">
    <div class="col-xs-2 icon" :class="'prio-' + tasktemplate.priority">
      <font-awesome-icon :icon="['fas', 'clock']"></font-awesome-icon>
    </div>
    <div class="media-body col-xs-10">
      <router-link
        :to="{name: 'tasktemplates.update', params: { id: $route.params.id, tid: tasktemplate.id } }"
      >
        <p>Erstellt am {{ moment(tasktemplate.created_at).format('LL') }}</p>
        <h3 class="mt-0">{{ tasktemplate.title + " " + freq}}</h3>
        <p>{{tasktemplate.description}}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tasktemplate: Object
  },
  data() {
    return {
      freq: ""
    };
  },
  created() {
    this.showFreq(this.tasktemplate.freq);
  },
  methods: {
    showFreq(frequenz) {
      switch (frequenz) {
        case "daily":
          this.freq = "(täglich)";
          break;
        case "weekly":
          this.freq = "(wöchentlich)";
          break;
        case "monthly":
          this.freq = "(monatlich)";
          break;
        case "yearly":
          this.freq = "(jährlich)";
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
div.icon {
  padding: 1.5rem;
  font-size: 2.5rem;
  color: $green;
}

.icon.prio-0 {
  color: $green;
}

.icon.prio-5 {
  color: $yellow;
}

.icon.prio-10 {
  color: $red;
}
</style>