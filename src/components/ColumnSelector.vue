<!--结合 Checkbox 和 Dialog 来控制表格列的显隐。-->
<!--https://element.eleme.cn/#/zh-CN/component/checkbox-->
<!--https://element.eleme.cn/#/zh-CN/component/dialog-->
<template>
    <div class="column-selector">
        <el-button type="info" size="mini" plain icon="el-icon-s-operation" @click="handleClickColumnSelector">
            设置显示列
        </el-button>
        <el-dialog title="设置显示的表格列" width="30%" :visible.sync="dialogVisible" :show-close="false">
            <el-checkbox-group v-model="selectedColumns">
                <el-checkbox v-for="item in columnOptions" :key="item.value" :label="item.value">
                    {{ item.label }}
                </el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="handleDialogOk">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "ColumnSelector",
        data() {
            return {
                dialogVisible: false,
                // 被选中要显示的列
                selectedColumns: [],
                columnOptions: [
                    {
                        value: "type",
                        label: "类型"
                    },
                    {
                        value: "size",
                        label: "大小"
                    },
                    {
                        value: "updateTime",
                        label: "修改时间"
                    }
                ]
            };
        },
        methods: {
            handleClickColumnSelector() {
                this.selectedColumns = this.$store.getters.selectedColumnList;
                this.dialogVisible = true;
            },
            handleDialogOk() {
                // 通过提交mutation更新表格显示列
                this.$store.commit("changeSelectedColumnList", this.selectedColumns);
                this.dialogVisible = false;
            }
        }
    };
</script>

<style scoped>

</style>