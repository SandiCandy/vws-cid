<template>
  <router-link
    :to="{name: routename, params: { id: this.$route.params.id } }"
    type="button"
    class="btn btn-plus"
  >
    <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
  </router-link>
</template>

<script>
export default {
  props: ["routename"]
};
</script>
