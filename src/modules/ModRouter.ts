import { createRouter, createWebHistory } from "vue-router";
import Home from "../app/Home.vue";
import Settings from "../app/Settings.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/settings",
            name: "settings",
            component: Settings
        }
    ]
});

export default router;