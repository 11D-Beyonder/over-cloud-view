import router from "@/router/index";
import store from "@/store/index";

/**
 * https://www.jianshu.com/p/282ccdaf82e8
 *
 * 添加全局前置守卫，可以在触发导航之前进行一些处理，当处理完成后才会执行导航。
 *
 * 先调用接口，判断当前登录状态。
 * 判断将要去的路由是否需要登录，即刚才我们给路由添加的参数 meta.requireAuth 是否为 true，若为 true，表示需要登录后才可进入；若没有设置当前参数，或参数值为 false，表示无需登录也可进入。
 * 当 meta.requireAuth 为 true 时，判断在 Vuex 中保存的 isLogin 为 true 还是 false，为 true 表示已登录，那么执行 next() 即可正常导航；为 false 表示未登录，按照之前的说明，将跳转到登录页面。
 * 全局前置守卫有三个参数 to、from、next：
 *
 * `to`：即将要进入的路由对象，包含路由名称、路径、参数等。
 *
 * `from`：当前导航正要离开的路由对象。
 *
 * `next`：在全局前置守卫中， 一定要调用该方法来 resolve 这个钩子；
 * 执行效果依赖 next 方法的调用参数：next()无参数时， 进行管道中的下一个钩子；
 * next(false) 参数为 false 时，中断当前的导航；next({ path: '/' }) 跳转到一个不同的地址，当前的导航被中断，然后进行一个新的导航。
 */

// 路由全局前置守卫
router.beforeEach((to, from, next) => {
    //调用接口判断登录状态
    store.dispatch("getUserInfo").then(() => {
        if (to.matched.some((m) => m.meta.requireAuth)) {
            if (store.getters.isLogin) {
                next();
            } else {
                next("/login");
            }
        } else {
            next();
        }
    });
});