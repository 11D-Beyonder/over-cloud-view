import Vue from "vue";
import Vuex from "vuex";
import user from "@/store/module/user";
import file from "@/store/module/file";
import image from "@/store/module/image";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    getters: {
        isLogin: (state) => state.user.isLogin,
        username: (state) => state.user.username,
        displayMode: (state) => (state.file.displayMode === null ? 0 : Number(state.file.displayMode)),
        selectedColumnList: (state) => state.file.selectedColumnList === null ? state.file.columnList : state.file.selectedColumnList.split(",")
    },
    mutations: {},
    actions: {},
    modules: {
        user,
        file,
        image
    }
});
