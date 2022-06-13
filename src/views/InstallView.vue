<!-- 安装系统 -->
<template>
    <div class="install-wrapper" id="install-background">
        <div class="form-wrapper">
            <h1 class="install-title">安装</h1>
            <!-- prop用于rules检查，:model绑定installForm。 -->
            <el-form :model="installForm" :rules="rules" ref="installForm" class="rule-form"
                     hide-required-asterisk>
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="installForm.username" placeholder="用户名"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" v-model="installForm.password" placeholder="密码"
                              show-password/>
                </el-form-item>
                <el-form-item class="install-button-wrapper">
                    <el-button class="install-button" type="primary" @click="submitForm('installForm')">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {install} from "@/requests/user";

    export default {
        name: "Install",
        data() {
            return {
                installForm: {
                    username: "",
                    password: "",
                },
                rules: {
                    username: [
                        {
                            required: true,
                            message: "请输入用户名",
                            trigger: "blur"
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: "请输入密码",
                            trigger: "blur"
                        },
                        {
                            min: 5,
                            max: 20,
                            message: "长度在5到20个字符",
                            trigger: "blur"
                        }
                    ]
                }
            };
        },
        methods: {
            // 注册按钮点击事件
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        install(this.installForm).then((res) => {
                            if (res.success) {
                                if(res.message)
                                this.$notify.success("系统安装成功");
                                // 注册成功之后清空表单
                                this.$refs[formName].resetFields();
                                this.$router.replace("/login");
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
                // 用户若已登录，自动跳转到首页
                this.$notify({
                    title: "成功",
                    message: "您已登录，跳转到首页。",
                    type: "success"
                });
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
    .install-wrapper
        height 500px
        min-height 500px
        width 100%
        padding-top 50px

        .form-wrapper
            width 375px
            margin 0 auto
            text-align center

            .install-title
                margin-bottom 10px
                font-weight 300
                font-size 30px
                color black

            // 使用深度选择器>>>穿透层级修改第三方库组件样式

            .rule-form
                width 100%
                margin-top 20px

                >>> .el-form-item__content
                    margin-left 0

                >>> .el-input__inner
                    font-size 10

                .install-button-wrapper
                    .install-button
                        width 100%

                    >>> .el-button
                        padding 10px 90px
                        font-size 16px
</style>