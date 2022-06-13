<!--https://element.eleme.cn/#/zh-CN/component/tree-->
<!--使用 Element UI 的 Tree 树形控件，-->
<!--在对话框内以树形结构显示文件夹，并使用树形控件的 node-click 事件，-->
<!--获取当前点击的文件夹路径，向父组件触发事件，-->
<!--在父组件中保存移动文件的目标路径。-->
<!--对话框点击确定按钮时，向父组件触发事件，在回调函数中调用移动文件接口；-->
<!--对话框点击取消按钮时，关闭对话框。-->
<template>
    <div class="move-dialog-wrapper">
        <el-dialog title="选择目录" :visible="moveFileDialog.visible" :show-close="false">
            <div class="el-dialog-div">
                <el-tree :data="moveFileDialog.fileTree" :props="defaultProps" :highlight-current="true"
                         default-expand-all @node-click="selectNodeClick"/>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="$emit('handleMoveFile', false)">取 消</el-button>
                <el-button type="primary" @click="$emit('confirmMoveFile')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "MoveFileDialog",
        props: {
            moveFileDialog: Object
        },
        data() {
            return {
                defaultProps: {
                    children: "children",
                    label: "label"
                }
            };
        },
        methods: {
            selectNodeClick(data) {
                this.$emit("setSelectFilePath", data.filePath);
            }
        }
    };
</script>

<style lang="stylus" scoped>
    @import '~@/assets/style/mixins.styl'

    .move-dialog-wrapper
        >>> .el-dialog
            .el-dialog__header
                display flex

            .el-dialog__body
                padding 10px 30px

                .el-dialog-div
                    height 300px
                    overflow auto
                    setScrollbar(6px)

                    .el-tree
                        .el-tree-node__content
                            height 34px
                            font-size 16px

                        .el-tree-node.is-current > .el-tree-node__content
                            color #409eff
</style>