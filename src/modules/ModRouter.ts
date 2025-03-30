import { createRouter, createWebHistory } from "vue-router";

const ModRouter = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: () => import("../views/Home.vue"),
        },
        {
            path: "/settings",
            name: "Settings",
            component: () => import("../views/Settings.vue"),
        },
        // Apps
        {
            path: "/apps/recipe",
            name: "ST.RecipeBrowser",
            component: () => import("../views/app/Recipe.vue"),
        },
    ],
});

ModRouter.beforeEach((_to, _from, next) => {
    document.getElementById("main-content")?.classList.add("opacity-0");
    setTimeout(() => {
        next();
        document.getElementById("main-content")?.classList.remove("opacity-0");
    }, 300);
});

export { ModRouter };
