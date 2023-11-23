import {createApp} from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

const pinia = createPinia();


import ElementPlus from "element-plus";

import "~/styles/index.scss";
import "uno.css";

import "element-plus/theme-chalk/src/message.scss";

const app = createApp(App);
app.use(ElementPlus);
app.use(pinia);

app.mount("#app");
