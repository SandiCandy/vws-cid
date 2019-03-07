require("./bootstrap");

import Vue from "vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCheck,
  faChevronLeft,
  faEllipsisV,
  faHome,
  faPlus,
  faSpinner,
  faTag
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faCheck,
  faHome,
  faTag,
  faEllipsisV,
  faChevronLeft,
  faPlus,
  faSpinner
);

Vue.component("font-awesome-icon", FontAwesomeIcon);

import { store } from "./store/store";
import VueRouter from "vue-router";
import VueCookies from "vue-cookies";
import App from "./App.vue";

import ShowTask from "./components/Task/Show.vue";
import NewTask from "./components/Task/New.vue";
import UpdateTask from "./components/Task/Update.vue";

import ShowTasktype from "./components/Tasktype/Show.vue";
import NewTasktype from "./components/Tasktype/New.vue";
import UpdateTasktype from "./components/Tasktype/Update.vue";

import ShowRoomtype from "./components/Roomtype/Show.vue";
import NewRoomtype from "./components/Roomtype/New.vue";
import UpdateRoomtype from "./components/Roomtype/Update.vue";

import ShowRoom from "./components/Room/Show.vue";
import NewRoom from "./components/Room/New.vue";
import UpdateRoom from "./components/Room/Update.vue";

import Quotes from "./components/quotes.vue";
import NewQuote from "./components/new-quote.vue";

import Login from "./components/Login/Login.vue";
import Signup from "./components/Signup/Signup.vue";
import Dashboard from "./components/Dashboard/Dashboard.vue";
import GroupBoard from "./components/Groupboard/Groupboard.vue";

Vue.use(VueRouter);
Vue.use(VueCookies);

const routes = [
  { path: "", component: Quotes },
  { path: "/new-quote", component: NewQuote },
  {
    path: "/group/:id/tasks",
    name: "tasks",
    component: ShowTask,
    meta: { requiresAuth: true }
  },
  {
    path: "/group/:id/tasks/new",
    name: "tasks.new",
    component: NewTask,
    meta: { requiresAuth: true }
  },
  {
    path: "/group/:id/tasks/:tid",
    name: "tasks.update",
    component: UpdateTask,
    meta: { requiresAuth: true }
  },
  {
    path: "/group/:id/tasktypes",
    name: "tasktypes.show",
    component: ShowTasktype,
    meta: { requiresAuth: true }
  },
  {
    path: "/group/:id/tasktypes/new",
    name: "tasktypes.new",
    component: NewTasktype,
    meta: { requiresAuth: true }
  },
  {
    path: "/group/:id/tasktypes/:ttid",
    name: "tasktypes.update",
    component: UpdateTasktype,
    meta: { requiresAuth: true }
  },
  {
    path: "/group/:id/roomtypes",
    name: "roomtypes.show",
    component: ShowRoomtype,
    meta: { requiresAuth: true }
  },
  {
    path: "/group/:id/roomtypes/new",
    name: "roomtypes.new",
    component: NewRoomtype,
    meta: { requiresAuth: true }
  },
  {
    path: "/group/:id/roomtypes/:rtid",
    name: "roomtypes.update",
    component: UpdateRoomtype,
    meta: { requiresAuth: true }
  },
  {
    path: "/roomtype/:id/rooms",
    name: "rooms.show",
    component: ShowRoom,
    meta: { requiresAuth: true }
  },
  {
    path: "/roomtype/:id/rooms/new",
    name: "rooms.new",
    component: NewRoom,
    meta: { requiresAuth: true }
  },
  {
    path: "/roomtype/:id/rooms/:rid",
    name: "rooms.update",
    component: UpdateRoom,
    meta: { requiresAuth: true }
  },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  {
    path: "/group/:id",
    name: "group",
    component: GroupBoard,
    meta: { requiresAuth: true }
  },
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
  store,
  router: router,
  render: h => h(App)
});
