<!--https://element.eleme.cn/#/zh-CN/component/menu#ce-lan-->
<!--https://element.eleme.cn/#/zh-CN/component/icon-->
<!--侧边栏，按照文件类型显示不同文件。-->
<template>
    <el-menu class="side-menu" :default-active="activeIndex" :router="true" :collapse="isCollapsed">
        <div class="fold-wrapper">
            <i class="el-icon-s-unfold" v-if="isCollapsed" title="展开" @click="isCollapsed=false"/>
            <i class="el-icon-s-fold" v-else title="收缩" @click="isCollapsed=true"/>
        </div>
        <el-menu-item index="0" :route="{ name: 'Home', query: { fileType: 0, filePath: '/' } }">
            <i class="el-icon-menu"/>
            <span slot="title">全部</span>
        </el-menu-item>
        <el-menu-item index="1" :route="{ name: 'Home', query: { fileType: 1 } }">
            <i class="el-icon-picture"/>
            <span slot="title">相册</span>
        </el-menu-item>
        <el-menu-item index="2" :route="{ name: 'Home', query: { fileType: 2 } }">
            <i class="el-icon-document"/>
            <span slot="title">档案库</span>
        </el-menu-item>
        <el-menu-item index="3" :route="{ name: 'Home', query: { fileType: 3 } }">
            <i class="el-icon-video-camera-solid"/>
            <span slot="title">放映室</span>
        </el-menu-item>
        <el-menu-item index="4" :route="{ name: 'Home', query: { fileType: 4 } }">
            <i class="el-icon-headset"/>
            <span slot="title">音乐馆</span>
        </el-menu-item>
        <el-menu-item index="5" :route="{ name: 'Home', query: { fileType: 5 } }">
            <i class="el-icon-takeaway-box"/>
            <span slot="title">回收站</span>
        </el-menu-item>
        <el-menu-item index="6" :route="{ name: 'Home', query: { fileType: 6 } }">
            <i class="el-icon-share"/>
            <span slot="title">分享</span>
        </el-menu-item>
        <div class="storage-wrapper" v-show="!isCollapsed">
            <el-progress :percentage="storagePercentage" :color="storageColor" :show-text="false"/>
            <div class="text">
                <span>存储</span>
                <span>{{ storageValue|storageTrans }}/{{ storageMaxValue|storageTrans(true) }}</span>
            </div>
        </div>
    </el-menu>
</template>

<script>
    export default {
        name: "SideMenu",
        props: {
            storageValue: {
                type: Number,
                require: true
            },
            storageMaxValue: {
                type: Number,
                require: true
            },
            storagePercentage: {
                type: Number,
                require: true
            },
        },
        data() {
            return {
                isCollapsed: false,
                storageColor: [
                    {color: "#67C23A", percentage: 50},
                    {color: "#E6A23C", percentage: 80},
                    {color: "#F56C6C", percentage: 100}
                ]
            };
        },
        watch: {
            isCollapsed(newValue) {
                sessionStorage.setItem("isCollapsed", newValue);
            }
        },
        filters: {
            storageTrans(size, status) {
                const B = 1024;
                const KB = Math.pow(1024, 2);
                const MB = Math.pow(1024, 3);
                const GB = Math.pow(1024, 4);
                console.log('storageTrans'+size);
                if (status) {
                    //    截取整数部分
                    if (!size) {
                        return 0 + "KB";
                    } else if (size < KB) {
                        return (size / B).toFixed(0) + "KB";
                    } else if (size < MB) {
                        return (size / KB).toFixed(0) + "MB";
                    } else if (size < GB) {
                        return (size / MB).toFixed(0) + "GB";
                    } else {
                        return (size / GB).toFixed(0) + "TB";
                    }
                } else {
                    if (!size) {
                        return 0 + "KB";
                    } else if (size < KB) {
                        return (size / B).toFixed(0) + "KB";
                    } else if (size < MB) {
                        return (size / KB).toFixed(2) + "MB";
                    } else if (size < GB) {
                        return (size / MB).toFixed(3) + "GB";
                    } else {
                        return (size / GB).toFixed(4) + "TB";
                    }
                }
            }
        },
        created() {
            this.isCollapsed = sessionStorage.getItem("isCollapsed") === "true";
        },
        computed: {
            // 当前激活菜单的 index
            activeIndex() {
                //  获取当前路由参数中包含的文件类型
                return this.$route.query.fileType.toString();
            },
            // storagePercentage() {
            //     return (this.storageValue / this.storageMaxValue) * 100;
            // }
        }
    };
</script>

<style lang="stylus" scoped>
    @import '~@/assets/style/mixins.styl'

    .side-menu
        // 高度设置为屏幕高度减去顶部导航栏的高度
        height calc(100vh - 61px)
        overflow auto
        // 调整滚动条样式
        setScrollbar(6px)

    .storage-wrapper
        position absolute
        bottom 0
        left 0
        box-sizing border-box
        width 100%
        padding 16px
        z-index 2
        color black
        opacity 0.8

        .text
            margin-top 8px
            display flex
            justify-content space-between
            align-items center
            font-size 14px

    .fold-wrapper
        height 56px
        line-height 56px
        padding 0 20px
        text-align right
        color white
        font-size 24px

    .el-icon-s-unfold, .el-icon-s-fold
        cursor pointer
        color black

        &:hover
            opacity 0.5


    // 对展开状态的菜单设置宽度

    .side-menu:not(.el-menu--collapse)
        width 200px
</style>
