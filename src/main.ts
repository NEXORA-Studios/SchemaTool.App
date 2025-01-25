import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import router from "./modules/ModRouter.ts";
import { ModSetting } from "./modules/ModSetting.ts";
import { ModCache } from "./modules/ModCache.ts";

createApp(App).use(router).mount("#app");

(async () => {
    await ModSetting.initCheck(); // Make sure config file is up-to-date.
    await ModCache.initCheck();
})();