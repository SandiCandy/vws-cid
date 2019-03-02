<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3>
              <span class="glyphicon glyphicon-dashboard"></span> Login
            </h3>
            <br>
            <button @click="showLoginForm()" class="btn btn-success" style="padding:5px">Login</button>
          </div>

          <div class="panel-body"></div>
        </div>
      </div>
    </div>

    <div class="modal fade" tabindex="-1" role="dialog" id="login_modal">
      <div class="modal-dialog" role="document">
        <login-form @login="emitToRoot"></login-form>
      </div>
      <!-- /.modal-dialog -->
    </div>
  </div>
</template>



<script>
import LoginForm from "./LoginForm.vue";
export default {
  components: {
    LoginForm
  },
  data() {
    return {};
  },

  mounted() {
    this.showLoginForm();
  },

  methods: {
    showLoginForm() {
      $("#login_modal").modal("show");
    },
    emitToRoot() {
      this.$emit("login");
    }
  }
};
</script>