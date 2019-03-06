import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    pagetitle: "Tuu:du"
    // token: this.$cookies.get("token") || ""
  },
  mutations: {
    changePage(state, pagetitle) {
      state.pagetitle = pagetitle;
    }
  },
  getters: {
    pagetitle: state => state.pagetitle
    // token: state => state.token
  }
});
