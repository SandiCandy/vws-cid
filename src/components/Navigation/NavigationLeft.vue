<template>
  <ul class="nav navbar-nav mr-auto tudu-blu">
    <li class="nav-item">
      <router-link :to="{name: 'dashboard' }">Gruppenübersicht</router-link>
    </li>
    <li class="nav-item">
      <router-link :to="{name: 'user.settings' }">Einstellungen</router-link>
    </li>
    <li class="nav-item">
      <router-link :to="{name: ''}">Gruppeneinstellungen</router-link>
    </li>
  </ul>
</template>

<script>
export default {};
</script>