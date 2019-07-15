<template>
  <div>
    <div class="img-wrap">
      <span data-toggle="modal" data-target="#deleteImgModal" class="close">&times;</span>
      <img :src="backend_url + '/storage/' + image.name" width="400" />
    </div>

    <div
      class="modal fade"
      id="deleteImgModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <p>Möchtest du das Bild wirklich löschen?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn text-secondary" data-dismiss="modal">Abbrechen</button>
            <button v-on:click="removeImage()" type="button" class="btn btn-danger">Löschen</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: Object,
    tid: Number
  },
  data() {
    return {
      backend_url: process.env.ROOT
    };
  },
  methods: {
    removeImage() {
      axios
        .delete(
          process.env.ROOT_API +
            "/auth/tasks/" +
            this.tid +
            "/images/" +
            this.image.id
        )
        .then(response => {
          $("#deleteImgModal").modal("hide");
          console.log("remove image");
          window.location.reload();
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>

<style scoped>
.img-wrap {
  position: relative;
  display: inline-block;
}
.img-wrap .close {
  position: absolute;
  top: -16px;
  right: -18px;
  z-index: 100;
  background-color: #3dbdbd;
  color: #ffffff;
  cursor: pointer;
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 50px;
  line-height: 28px;
  border-radius: 50%;
  opacity: 1;
}
.img-wrap:hover .close {
  background-color: $red;
}
</style>
