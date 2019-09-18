<template>
  <section class="lead">
    Es gibt aktuell keine Aufgaben 😢. Trage doch einfach eine
    <router-link :to="{name: 'tasks.new', params: { id: this.$route.params.id } }">neue Aufgabe ein!</router-link>
  </section>
</template>
