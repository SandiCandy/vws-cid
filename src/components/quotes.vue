<!-- groups.vue -->
<template>
  <div>
    <div class="text-center">
      <button class="btn btn-success" @click="onGetgroups">Get groups</button>
    </div>
    <hr>
    <app-group
      v-for="group in groups"
      :group="group"
      :key="group.id"
      @groupDeleted="ongroupDeleted($event)"
    ></app-group>
  </div>
</template>

<script type="text/babel">
import group from "./group.vue";
import axios from "axios";
export default {
  data() {
    return {
      groups: []
    };
  },
  methods: {
    onGetgroups() {
      axios
        .get("http://localhost:8000/api/groups")
        .then(response => {
          this.groups = response.data.data;
          console.log(response.data.data);
        })
        .catch(error => console.log(error));
    },
    ongroupDeleted(id) {
      const position = this.groups.findIndex(element => {
        return element.id == id;
      });
      this.groups.splice(position, 1);
    }
  },
  mounted: function() {
    this.onGetgroups();
  },
  components: {
    "app-group": group
  }
};
</script>