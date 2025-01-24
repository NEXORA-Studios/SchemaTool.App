import { createRouter, createWebHistory } from "vue-router";

const createAppRouteRecord = (appName: string) => ({
    path: `/app/${appName.toLowerCase()}`,
    name: `Frm${appName}`,
    component: () =>
        import(`../app/miniapps/Frm${appName}.vue`)
});

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "FrmHome",
            component: () => import("../app/FrmHome.vue")
        },
        // #Region MiniApps
        createAppRouteRecord("LiteView"),
        // #EndRegion
        {
            path: "/settings",
            name: "FrmSettings",
            component: () => import("../app/FrmSettings.vue")
        }
    ]
});

export default router;