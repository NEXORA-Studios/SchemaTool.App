import { createApp } from "vue";
import App from "./App.vue";
import { ModRouter } from "./modules/ModRouter";

const app = createApp(App);
app.use(ModRouter);
app.mount("#app");

import "./assets/main.css";
import "./assets/tailwind.css";