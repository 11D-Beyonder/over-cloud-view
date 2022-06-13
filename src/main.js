import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import ElementUI from "element-ui";
import "@/assets/theme/index.css";
import "@/router/before";
import uploader from "vue-simple-uploader";
import GlobalFunction from "@/libs/global-function";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(uploader);
Vue.use(GlobalFunction);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
