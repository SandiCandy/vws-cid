<template>
  <v-menu
    ref="menu"
    v-model="menu_time"
    :close-on-content-click="false"
    :top="true"
    :left="true"
    :return-value.sync="my_time"
    transition="scale-transition"
    offset-y
    full-width
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="my_time"
        :label="my_label"
        prepend-icon="mdi-calendar-clock"
        readonly
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="menu_time"
      v-model="my_time"
      color="#D93838"
      format="24hr"
      full-width
      @click:minute="emitTime"
    ></v-time-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    old_time: String,
    my_label: String,
    emit: String
  },
  data() {
    return {
      menu_time: null,
      my_time: this.old_time
    };
  },
  methods: {
    emitTime() {
      this.$refs.menu.save(this.my_time);
      this.$emit(this.emit, this.my_time);
    }
  }
};
</script>

<style>
#timepicker .primary--text {
  color: #ddd;
}
</style>