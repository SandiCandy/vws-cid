<template>
  <ul class="nav navbar-nav mr-auto tudu-blu">
    <li class="nav-item">
      <router-link :to="{name: 'dashboard' }">Meine Gruppen</router-link>
    </li>
    <li class="nav-item">
      <router-link :to="{name: 'user.settings' }">Einstellungen</router-link>
    </li>
  </ul>
</template>

<script>
export default {};
</script>