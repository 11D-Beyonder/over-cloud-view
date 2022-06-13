<!--文件夹添加、文件上传-->
<template>
    <div class="operation-menu-wrapper">
        <!--按钮组-->
        <el-button-group class="operation-group">
            <el-button size="mini" type="primary" icon="el-icon-plus" v-if="fileType===0"
                       @click="addFolderDialog.visible=true">
                新建文件夹
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleClickUploadFile"
                       v-if="fileType===0">
                上传文件
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-rank" :disabled="!operationFileList.length"
                       v-if="fileType===0" @click="handleClickMoveFile">
                批量移动
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-delete" :disabled="!operationFileList.length"
                       @click="handleClickDeleteFile">
                批量删除
            </el-button>
        </el-button-group>
        <!--对话框 新建文件夹-->
        <el-dialog title="新建文件夹" :show-close="false" :visible="addFolderDialog.visible"
                   @closed="$refs.addFolderForm.resetFields()">
            <el-form :model="addFolderForm" :rules="addFolderRules" label-position="top" ref="addFolderForm">
                <el-form-item label="文件夹名称" prop="name">
                    <el-input v-model="addFolderForm.name"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFolderDialog.visible=false">取消</el-button>
                <el-button type="primary" :loading="addFolderDialog.loading"
                           @click="handleAddFolderSubmit('addFolderForm')">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {batchDeleteFile, createFolder} from "@/requests/file";

    export default {
        name: "OperationMenu",
        props: {
            fileType: {
                type: Number,
                required: true
            },
            filePath: {
                type: String,
                required: true
            },
            operationFileList: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                addFolderDialog: {
                    visible: false,
                    loading: false
                },
                addFolderForm: {
                    name: ""
                },
                addFolderRules: {
                    name: [
                        {
                            required: true,
                            message: "请输入文件夹名称",
                            trigger: "blur, change"
                        }
                    ]
                }
            };
        },
        methods: {
            handleAddFolderSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addFolderDialog.loading = true;
                        console.log(this.addFolderForm.name)
                        console.log(this.filePath);
                        createFolder({
                            name: this.addFolderForm.name,
                            path: this.filePath
                        }).then((res) => {
                            this.addFolderDialog.loading = false;
                            if (res.success) {
                                this.addFolderDialog.visible = false;
                                this.$emit("getTableData");
                            } else {
                                this.$message.error(res.message);
                            }
                        }, (error) => {
                            this.addFolderDialog.loading = false;
                            console.log(error);
                        });
                    } else {
                        this.$message.warning("请填写文件夹名称");
                        return false;
                    }
                });
            },
            handleClickUploadFile() {
                this.$emit("handleUploadFile", true);
            },
            handleClickDeleteFile() {
                this.$confirm("是否批量删除这些文件？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    showClose: false
                }).then(() => {
                    batchDeleteFile({
                        files: JSON.stringify(this.operationFileList)
                    }).then((res) => {
                        if (res.success) {
                            if(res.message){
                                this.$message.success(res.message);
                            }
                            this.$emit("getTableData");
                        } else {
                            this.$message.error(res.message);
                        }
                    }).catch(() => {
                        this.$message.info("取消批量删除");
                    });
                });
            },
            handleClickMoveFile() {
                this.$emit('handleSelectFile',true,this.operationFileList)
                this.$emit("handleMoveFile", true);
            }
        }
    };
</script>