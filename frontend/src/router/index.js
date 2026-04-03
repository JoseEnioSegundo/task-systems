import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import TarefasView from "@/views/TarefasView.vue";
import AboutView from "@/views/AboutView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/tarefas", name: "tarefas", component: TarefasView },
  { path: "/about", name: "about", component: AboutView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;