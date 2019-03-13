<template>
  <div class="success">
    <div class="d-flex justify-content-center">
      <font-awesome-icon :icon="['fas', 'check']" class="display-4 d-block justify-content-center"></font-awesome-icon>
    </div>
    <p class="text-center display-5 d-flex justify-content-center">{{ msg }}</p>
  </div>
</template>

<script >
export default {
  props: ["msg"]
};
</script>
      