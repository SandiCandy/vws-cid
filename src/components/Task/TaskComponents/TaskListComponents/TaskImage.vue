<template>
  <div class="img col-xs-2">
    <img
      :src="backend_url + '/storage/' + images[0].name"
      :class="'prio-' + priority"
      v-if="images.length > 0"
      height="45"
    />
    <!-- Empty div für priority corner -->
    <div class="prio-corner"></div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      backend_url: process.env.ROOT
    };
  },
  props: {
    priority: Number,
    images: Array
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.prio-corner {
  background-color: #444;
  height: 40px;
  left: -20px;
  position: absolute;
  top: -20px;
  width: 40px;

  -webkit-transform: rotate(-45deg);
}

div.img {
  overflow: hidden;
  position: relative;
  margin-right: 1rem;
  background-color: $highlight-color;
  width: 45px;
  height: 45px;
}

.media-body {
  word-break: break-word;
}

.prio-0 .prio-corner {
  background-color: $green;
}

.prio-5 .prio-corner {
  background-color: $yellow;
}

.prio-10 .prio-corner {
  background-color: $red;
}
</style>