<!--分页显示-->
<template>
    <el-pagination class="file-pagination" :current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
                   :total="pageInfo.total" :page-sizes="[10,20,50,100]" layout="sizes,total,prev,pager,next"
                   @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
</template>

<script>
    export default {
        name: "FilePagination",
        props: {
            pageInfo: {
                type: Object,
                required: true
            }
        },
        methods: {
            /*
                使用扩展运算符 ...
                将创建新的pageInfo
             */
            // 分页组件 当前页码改变
            handleCurrentChange(currentPage) {
                this.$emit("changePageInfo", {
                    ...this.pageInfo,
                    currentPage: currentPage
                });
            },
            // 分页组件 当前页面大小改变
            handleSizeChange(pageSize) {
                this.$emit("changePageInfo", {
                    ...this.pageInfo,
                    pageSize: pageSize
                });
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .file-pagination
        margin-top 16
        text-align right
</style>