<template>
    <ul class="file-list" v-loading="loading" element-loading-text="加载中……">
        <li class="file-item" v-for="(item, index) in tableData" :key="index" :title="`${item.name}.${item.extension}`"
            @click="handleClick(index, tableData)">
            <el-image class="file-img" :src="downloadImgMin(item.url)"/>
            <div class="file-name">{{ item.name }}.{{ item.extension }}</div>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "FileGrid",
        props: {
            fileType: {
                type: Number,
                required: true
            },
            // 文件数据
            tableData: {
                type: Array,
                required: true,
            },
            // 加载状态
            loading: {
                type: Boolean,
                required: true,
            }
        },
        methods: {
            //  文件点击事件
            handleClick(activeIndex, fileList) {
                if (this.fileType === 1) {
                    //  图片分类下 - 大图查看
                    let data = {
                        imageVisible: true,
                        imageList: fileList.map((item) => {
                            return {
                                url: `/api${item.url}`,
                                downloadLink: `/api/transfer/download?id=${item.id}`,
                                name: item.name,
                                extension: item.extension
                            };
                        }),
                        activeIndex: activeIndex
                    };
                    this.$store.commit("setImageViewData", data); // 触发图片在线查看
                } else if (this.fileType === 3) {
                    console.log("视频");
                }
            }
        }
    };
</script>

<style lang="stylus" scoped>
    @import '~@/assets/style/mixins.styl'

    .file-list
        height calc(100vh - 202px)
        display flex
        flex-wrap wrap
        align-items flex-start
        align-content flex-start
        list-style none
        overflow-y auto
        setScrollbar(8px)

        .file-item
            margin 16px 16px 0 0
            border-radius 4px
            width 120px
            padding 8px
            cursor pointer
            text-align center

            &:hover
                background #F5F7FA

            .file-img
                width 100px
                height 100px

            .file-name
                line-height 24px
                font-size 12px
                word-break break-all
                setEllipsis(2)
</style>