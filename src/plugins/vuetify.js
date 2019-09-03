// src/plugins/vuetify.js
// import "@fortawesome/fontawesome-free/css/all.css";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

// const MY_ICONS = {
//   calendar: "fas fa-calendar"
// };
export default new Vuetify({
  icons: {
    iconfont: "mdi" // default - only for display purposes
  }
});
