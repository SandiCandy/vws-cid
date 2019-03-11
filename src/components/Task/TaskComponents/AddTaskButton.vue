<template>
  <router-link
    :to="{name: 'tasks.new', params: { id: this.$route.params.id } }"
    type="button"
    class="btn btn-plus"
  >
    <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
  </router-link>
</template>
