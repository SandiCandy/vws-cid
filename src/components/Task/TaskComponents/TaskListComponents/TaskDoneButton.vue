<template>
  <button type="button" class="col-xs-2 checkbox is-done">
    <font-awesome-icon :icon="['fas', 'check']" class="checkbox"></font-awesome-icon>
  </button>
</template>


<script>
export default {};
</script>

<style lang="scss" scoped>
button.is-done {
  background: transparent;
  border: inherit;
  position: relative;
  right: 5px;
}

svg.checkbox {
  border: 2px solid #b4b4b4;
  color: #dddddd;
  height: 45px;
  width: 45px;
  padding: 0px 2px;

  &:active {
    color: green;
    border-color: green;
  }
}
</style>