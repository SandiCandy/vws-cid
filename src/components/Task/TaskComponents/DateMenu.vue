<template>
  <v-menu
    v-model="menu1"
    :close-on-content-click="false"
    :top="true"
    :left="true"
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="my_date"
        :label="my_label"
        prepend-icon="mdi-calendar-edit"
        readonly
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker color="#D93838" v-model="my_date" @input="emitDate"></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    old_date: String,
    my_label: String,
    emit: String
  },
  data() {
    return {
      menu1: null,
      my_date: this.old_date
    };
  },
  methods: {
    emitDate(val) {
      this.menu1 = false;
      this.$emit(this.emit, val);
    }
  }
};
</script>