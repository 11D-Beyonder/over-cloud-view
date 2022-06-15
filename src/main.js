import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import ElementUI from "element-ui";
import "@/assets/theme/index.css";
import "@/router/before";
import uploader from "vue-simple-uploader";
import GlobalFunction from "@/libs/global-function";
import VueCoreVideoPlayer from 'vue-core-video-player'
import APlayer from '@moefe/vue-aplayer';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import pdf from 'vue-pdf'

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(uploader);
Vue.use(GlobalFunction);
Vue.use(VueCoreVideoPlayer, {
    lang: 'zh-CN'
})
Vue.use(APlayer, {
    defaultCover: 'https://github.com/u3u.png',
    productionTip: true,
});
Vue.use(mavonEditor);
Vue.use(VueCodemirror, /* {
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */)
Vue.use(pdf)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
