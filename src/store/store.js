import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    pagetitle: "Tuu:du",
    loading: false,
    error: null
    // token: this.$cookies.get("token") || ""
  },
  mutations: {
    changePage(state, pagetitle) {
      state.pagetitle = pagetitle;
    },
    isLoading(state, loading) {
      state.loading = loading;
    },
    hasError(state, error) {
      state.error = error;
    }
  },
  getters: {
    pagetitle: state => state.pagetitle,
    loading: state => state.loading,
    error: state => state.error
    // token: state => state.token
  }
});
