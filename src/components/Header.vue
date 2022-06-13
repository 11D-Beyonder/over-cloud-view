<!--导航栏 https://element.eleme.cn/#/zh-CN/component/menu-->
<!--其中的 el-menu 即为 Element UI 中的 NavMenu 导航菜单，-->
<!--:router="true" 表示使用 vue-router 的模式， -->
<!--index 是每个导航菜单的唯一标志，这里配置为各个页面对应的路由名称 name，-->
<!--default-active 为当前激活菜单的 index，为了刷新页面时也可以保证停留在当前页面，-->
<!--这里采用计算属性的方式给 activeIndex 赋值。-->
<!--<el-menu-item> 中的属性 route 为 Vue Router 路径对象，即要跳转到的页面的路由对象，-->
<!--这里依次配置为首页、登录、注册页面的路由对象。-->

<!--在已登录时，导航栏添加退出菜单，未登录时隐藏此菜单。-->
<!--在已登录时，隐藏登录和注册菜单，并显示用户名，未登录时显示这两个菜单，并隐藏用户名。-->
<!--登录状态和用户名均保存在 Vuex 中，可以通过 computed 获取。-->
<template>
    <el-menu class="header-menu" :default-active="activeIndex" :router="true" mode="horizontal">
        <el-menu-item index="Home" v-show="isLogin" :route="{ name:'Home', query: { fileType: 0, filePath: '/' } }">
            <span style="font-size: larger;font-family: 华文行楷">云上云 OverCloud</span>
        </el-menu-item>
        <el-menu-item index="Login" class="login" :route="'/login'" v-show="!isLogin">登录</el-menu-item>
        <el-menu-item index="Install" class="register" :route="'/install'" v-show="!isLogin">安装</el-menu-item>
        <div class="el-menu-item exit" @click="exitButtonClick" v-show="isLogin">
            退出
        </div>
        <!-- 为了和其他菜单样式保持一致，请一定要添加类名 el-menu-item -->
        <div class="el-menu-item username" v-show="isLogin">
            <el-image src="favicon.ico"
                      style="height: 40px;width: 40px;border-radius: 50%;margin-right: 10px;margin-bottom: 10px"/>
            {{ username }}
        </div>
    </el-menu>
</template>

<script>

    export default {
        name: "Header",
        computed: {
            // 当前激活菜单的index
            activeIndex() {
                // 获取当前路由名称
                return this.$route.name;
            },
            // 登录状态
            isLogin() {
                return this.$store.getters.isLogin;
            },
            // 用户名
            username() {
                return this.$store.getters.username;
            }
        },
        methods: {
            exitButtonClick() {
                localStorage.removeItem("cloud-token");
                this.$router.push("/login");
                this.$notify.success({
                    message: "您已退出登录",
                    duration: 500
                });
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .header-menu
        padding 0 24px;

        .login, .register, .username, .exit
            float right
</style>