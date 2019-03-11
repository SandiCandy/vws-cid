<template>
  <section class="lead">Es gibt noch keine Aufgaben 😢. Trage doch einfach deine
    <router-link
      :to="{name: 'tasks.new', params: { id: this.$route.params.id } }"
    >erste Aufgabe ein!</router-link>
  </section>
</template>
