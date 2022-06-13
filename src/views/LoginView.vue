<template>
    <div class="login-wrapper" id="login-background">
        <div class="form-wrapper">
            <h1 class="login-title">登录</h1>
            <el-form :model="loginForm" ref="loginForm" :rules="rules" class="login-form" hide-required-asterisk>
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-mobile-phone" v-model="loginForm.username" placeholder="用户名"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" placeholder="密码" show-password/>
                </el-form-item>
                <el-form-item class="login-button-wrapper">
                    <el-button class="login-button" type="primary" @click="submitForm('loginForm')">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {login} from "@/requests/user";

    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: "",
                    password: ""
                },
                rules: {
                    password: [
                        {
                            required: true,
                            message: "请输入密码",
                            trigger: "blur"
                        }
                    ],
                    username: [
                        {
                            required: true,
                            message: "请输入用户名",
                            trigger: "blur"
                        }
                    ]
                }
            };
        },
        methods: {
            // 登录按钮点击事件
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        login(this.loginForm, true).then((res) => {
                            if (res.success) {
                                // 添加token
                                localStorage.setItem("cloud-token", res.data.token);
                                this.$notify.success({
                                    message: "您已登录",
                                    duration: 800
                                });
                                this.$refs[formName].resetFields();
                                this.$router.replace({
                                    name: "Home",
                                    query: {
                                        fileType: 0,
                                        filePath: "/"
                                    }
                                });
                            } else {
                                this.$message.error(res.message);
                            }
                        });
                    } else {
                        this.$message.error("请完善信息");
                        return false;
                    }
                });
            }
        },
        created() {
            if (this.$store.getters.isLogin) {
                // 用户若登录，自动跳转到首页
                this.$notify.success("您已登录，已自动跳转到首页。");
                this.$router.replace({
                    name: "Home",
                    query: {
                        fileType: 0,
                        filePath: "/"
                    }
                });
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .login-wrapper
        height 550px
        min-height 550px
        padding-top 50px

        .form-wrapper
            width 375px
            margin 0 auto
            text-align center

        .login-title
            margin-bottom 10px
            font-weight 300
            font-size 30px
            color black

        .login-form
            width 100%
            margin-top 20px

            >>> .el-form-item__content
                margin-left 0

            >>> .el-input__inner
                font-size 16px

            .forget-password
                text-align right
                margin -22px 0 0 0

            .login-button-wrapper
                .login-button
                    width 100%

                >>> .el-button
                    padding 10px 90px
                    font-size 16px
</style>