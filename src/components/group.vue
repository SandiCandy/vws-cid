<!-- group.vue -->
<template>
  <div>
    <div v-if="editing">
      <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <div class="form-group" id="form__group">
          <label for="content">
            <b>Edit group</b>
          </label>
          <br>
          <textarea id="content" v-model="editValue" rows="10" cols="30" class="form-control"></textarea>
          <div class="control_1">
            <button @click="onUpdate" class="btn btn-success">Save</button>
            <button @click="onCancel" class="btn btn-danger">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!editing">
      <div class="col-lg-12">
        <div class="group-holder">
          <div class="group">{{ group.id}} {{ group.name }}</div>
          <div class="group_control">
            <div>
              <div class="control_1">
                <button @click="onEdit" class="btn btn-primary">Edit</button>
                <button @click="onDelete" class="btn btn-danger">Delete</button>
              </div>
              <div class="control_2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
export default {
  props: ["group"],
  data() {
    return {
      editing: false,
      editValue: this.group.content
    };
  },
  methods: {
    onEdit() {
      this.editing = true;
      this.editValue = this.group.content;
    },
    onCancel() {
      this.editing = false;
    },
    onDelete() {
      this.$emit("groupDeleted", this.group.id);
      axios
        .delete("http://localhost:8000/api/group/" + this.group.id)
        .then(response => console.log(response))
        .catch(error => console.log(error));
    },
    onUpdate() {
      this.editing = false;
      this.group.content = this.editValue;
      axios
        .put("http://localhost:8000/api/group/" + this.group.id, {
          content: this.editValue
        })
        .then(response => console.log(response))
        .catch(error => console.log(error));
    }
  }
};
</script>

<style scoped>
a {
  cursor: pointer;
}
.group {
  display: block;
  margin-left: auto;
  margin-right: auto;
  /*min-height: 125px;*/
}
.group-holder {
  background: #ffffff;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  padding: 20px;
  /* min-height: 250px; */
}
.group_btn {
  border-radius: 0;
  width: 100%;
  display: block;
  cursor: pointer;
}
.group_control {
  width: 100%;
  display: flex;
  padding: 20px 20px 15px;
  background: #fff;
}
.control_1 {
  flex: 2;
}
.control_2 {
  flex: 1;
  /*display: flex;*/
  justify-content: flex-end;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #51d2b7;
}
#form__group {
  box-sizing: border-box;
  overflow: hidden;
}
textarea {
  margin: 10px 0;
}
</style>