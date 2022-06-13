import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/HomeView";
import Login from "@/views/LoginView";
import NotFound from "@/views/NotFound";
import Install from "@/views/InstallView";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/install",
        name: "Install",
        component: Install
    },
    {
        path: "*",
        name: "NotFound",
        component: NotFound
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
