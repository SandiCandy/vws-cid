// src/plugins/vuetify.js
// import "@fortawesome/fontawesome-free/css/all.css";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import colors from "vuetify/lib/util/colors";
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

// const MY_ICONS = {
//   calendar: "fas fa-calendar"
// };
export default new Vuetify({
  icons: {
    iconfont: "mdi" // default - only for display purposes
  },
  theme: {
    themes: {
      light: {
        primary: colors.shades.white, // #E53935
        secondary: colors.red.lighten4, // #FFCDD2
        accent: colors.indigo.base // #3F51B5
      }
    }
  }
});
