<template>
  <section class="lead">Du hast noch keine Mitglieder in deinem Team 😢. Fang an und lade
    <router-link :to="{name: 'team.new', params: { id: this.$route.params.id } }">deine Freunde ein!</router-link>
  </section>
</template>
