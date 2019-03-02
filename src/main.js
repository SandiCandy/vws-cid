require("./bootstrap");

import Vue from "vue";
import VueRouter from "vue-router";
import VueCookies from "vue-cookies";
import App from "./App.vue";

import Task from "./components/Task/Main.vue";

import Quotes from "./components/quotes.vue";
import NewQuote from "./components/new-quote.vue";

import Login from "./components/Login/Login.vue";
import Signup from "./components/Signup/Signup.vue";
import Dashboard from "./components/Dashboard/Dashboard.vue";

Vue.use(VueRouter);
Vue.use(VueCookies);

const routes = [
  { path: "", component: Quotes },
  { path: "/new-quote", component: NewQuote },
  { path: "/tasks", component: Task, meta: { requiresAuth: true } },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/login", component: Login, meta: { guest: true } },
  { path: "/signup", component: Signup, meta: { guest: true } }
];
const router = new VueRouter({
  node: "history",
  routes: routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (VueCookies.get("token") == null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath }
      });
    } else {
      let user = JSON.parse(VueCookies.get("user"));
      if (to.matched.some(record => record.meta.is_admin)) {
        if (user.is_admin == 1) {
          next();
        } else {
          next({ path: "/dashboard" });
        }
      } else {
        next();
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (VueCookies.get("token") == null) {
      next();
    } else {
      next({ path: "/dashboard" });
    }
  } else {
    next();
  }
});

export default router;

new Vue({
  el: "#app",
  router: router,
  render: h => h(App)
});
