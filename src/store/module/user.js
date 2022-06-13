import {checkUserLoginInfo} from "@/requests/user";

export default {
    state: {
        isLogin: false,
        username: ""
    },
    mutations: {
        changeLogin(state, data) {
            state.isLogin = data;
        },
        changeUsername(state, data) {
            state.username = data;
        }
    },
    actions: {
        getUserInfo(context) {
            return checkUserLoginInfo().then((res) => {
                console.log(res);
                if (res.success) {
                    context.commit("changeLogin", res.success);
                    context.commit("changeUsername", res.data.username);
                } else {
                    context.commit("changeLogin", res.success);
                }
            });
        }
    }
};