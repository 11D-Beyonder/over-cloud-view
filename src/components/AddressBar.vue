<template>
    <div class="bread-crumb-wrapper">
        <div class="current-path">当前位置：</div>
        <!--按照类型查看-->
        <el-breadcrumb class="bread-crumb" v-if="fileType!==0" separator="/">
            <el-breadcrumb-item>{{ fileTypeMap[fileType] }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!--按照路径查看时-->
        <el-breadcrumb class="bread-crumb" v-else separator="/">
            <!-- 当点击导航栏某一级时改变路由-->
            <el-breadcrumb-item v-for="(item,index) in breadCrumbList" :key="index"
                                :to="{ query: { fileType: 0, filePath: item.path } }">
                {{ item.name }}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        name: "AddressBar",
        props: {
            fileType: {
                type: Number,
                required: true
            }
        },
        computed: {
            breadCrumbList() {
                let path = this.$route.query.filePath;
                console.log(path);
                let pathList = path ? path.split("/").slice(1, -1) : [];
                let res = [{name: "全部文件", path: "/"}];
                pathList.forEach((element, index) => {
                    // 路径拼接
                    res.push({
                        name: element,
                        path: `${res[index].path}${element}/`
                    });
                });
                console.log(res);
                return res;
            }
        },
        data() {
            return {
                fileTypeMap: {
                    1: "相册",
                    2: "档案库",
                    3: "放映室",
                    4: "音乐馆",
                    5: "回收站"
                }
            };
        }
    };
</script>

<style lang="stylus" scoped>
    .bread-crumb-wrapper
        height 32px
        line-height 32px
        display flex
        align-items center
</style>