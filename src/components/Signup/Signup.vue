<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3>
              <span class="glyphicon glyphicon-dashboard"></span> Registrierung
            </h3>
            <br>
            <button @click="showSignupForm()" class="btn btn-success" style="padding:5px">Login</button>
          </div>

          <div class="panel-body"></div>
        </div>
      </div>
    </div>

    <div class="modal fade" tabindex="-1" role="dialog" id="signup_modal">
      <div class="modal-dialog" role="document">
        <signup-form></signup-form>
      </div>
      <!-- /.modal-dialog -->
    </div>
  </div>
</template>



<script>
import SignupForm from "./SignupForm.vue";
export default {
  components: {
    SignupForm
  },
  data() {
    return {};
  },

  mounted() {
    this.showSignupForm();
  },

  methods: {
    showSignupForm() {
      $("#signup_modal").modal("show");
    }
  }
};
</script>