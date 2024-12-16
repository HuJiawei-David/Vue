// router/index.js
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/manager/home.vue"),
  },
  {
    path: "/results",
    name: "results",
    component: () => import("../views/manager/Results.vue"),
  },
  {
    path: "*",
    name: "404",
    component: () => import("../views/manager/404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;


