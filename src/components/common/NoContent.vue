<template>
  <section class="lead mx-2">
    Es gibt noch keine {{contenttype}} 😢. Trage doch einfach deine
    <router-link
      :to="{name: routename, params: { id: this.$route.params.id } }"
    >ersten {{contenttype}} ein!</router-link>
  </section>
</template>

<script>
export default {
  props: ["contenttype", "routename"]
};
</script>
