<template>
    <div class="home">
        <side-menu class="home-left" :storage-value="storageValue"/>
        <div class="home-right">
            <div class="operation-wrapper">
                <operation-menu :fileType="fileType" :filePath="filePath" @getTableData="getFileData"
                                :operationFileList="operationFileList" @handleUploadFile="handleUploadFile"
                                @handleSelectFile="setOperationFile" @handleMoveFile="setMoveFileDialog"/>
                <display-mode-changer :file-type="fileType"/>
                <column-selector/>
            </div>
            <address-bar :file-type="fileType"/>
            <file-table v-if="((fileType===1||fileType===3)&&displayMode===0)||(fileType!==1&&fileType!==3)"
                        :file-type="fileType"
                        :table-data="tableData" @getTableData="getFileData" :loading="loading"
                        @handleSelectFile="setOperationFile" @handleMoveFile="setMoveFileDialog"/>
            <file-grid :file-type="fileType" v-if="(fileType===1||fileType===3)&&displayMode===1" :table-data="tableData" :loading="loading"/>
            <file-pagination :page-info="pageInfo" @changePageInfo="changePageInfo"/>
        </div>
        <file-uploader ref="fileUploader" @getTableData="getFileData"/>
        <move-file-dialog :move-file-dialog="moveFileDialog" @setSelectFilePath="setSelectFilePath"
                          @confirmMoveFile="confirmMoveFile" @handleMoveFile="setMoveFileDialog"/>
        <image-viewer/>
    </div>
</template>

<script>
    import {
        batchMoveFile,
        getDeletedFile,
        getFileListByPath,
        getFileListByType,
        getFileTree,
        moveFile
    } from "@/requests/file";
    import ColumnSelector from "@/components/ColumnSelector";
    import SideMenu from "@/components/SideMenu";
    import FileTable from "@/components/FileTable";
    import FilePagination from "@/components/FilePagination";
    import AddressBar from "@/components/AddressBar";
    import FileUploader from "@/components/FileUploader";
    import OperationMenu from "@/components/OperationMenu";
    import MoveFileDialog from "@/components/MoveFileDialog";
    import DisplayModeChanger from "@/components/DisplayModeChanger";
    import FileGrid from "@/components/FileGrid";
    import ImageViewer from "@/components/ImageViewer";

    export default {
        name: "Home",
        components: {
            ImageViewer,
            FileGrid,
            DisplayModeChanger,
            MoveFileDialog,
            OperationMenu,
            FileUploader,
            AddressBar,
            FilePagination,
            FileTable,
            SideMenu,
            ColumnSelector
        },
        data() {
            return {
                storageValue: 580080,
                loading: false,
                tableData: [],
                pageInfo: {
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                },
                moveFileDialog: {
                    visible: false,
                    fileTree: []
                },
                // 是否批量操作
                isBath: false,
                // 单个操作的文件信息
                operationFile: {},
                // 批量操作的文件信息
                operationFileList: [],
                selectFilePath: ""
            };
        },
        computed: {
            // 对路由上的文件类型和文件路径，若不存在赋予默认值。
            fileType() {
                if (!this.$route.query.fileType) {
                    this.$route.query.fileType = "0";
                }
                return Number(this.$route.query.fileType);
            },
            filePath() {
                if (!this.$route.query.filePath) {
                    this.$route.query.filePath = "/";
                }
                return this.$route.query.filePath;
            },
            displayMode() {
                return this.$store.getters.displayMode;
            }
        },
        watch: {
            fileType() {
                this.getFileData();
            },
            filePath() {
                this.getFileData();
            }
        },
        mounted() {
            this.getFileData();
        },
        methods: {
            getFileData() {
                this.loading = true;
                if (this.fileType === 0) {
                    this.getFileDataByPath();
                } else if (this.fileType === 5) {
                    this.getFileDataInTrash();
                } else {
                    this.getFileDataByType();
                }
            },
            getFileDataInTrash() {
                getDeletedFile({
                    currentPage: this.pageInfo.currentPage,
                    pageSize: this.pageInfo.pageSize
                }).then((res) => {
                    this.loading = false;
                    if (res.success) {
                        this.tableData = res.data.list;
                        this.pageInfo.total = res.data.total;
                    } else {
                        this.$message.error(res.message);
                    }
                }, (error) => {
                    this.loading = false;
                    console.log(error);
                });
            },
            getFileDataByPath() {
                getFileListByPath({
                    path: this.filePath,
                    currentPage: this.pageInfo.currentPage,
                    pageSize: this.pageInfo.pageSize
                }).then((res) => {
                    this.loading = false;
                    if (res.success) {
                        this.tableData = res.data.list;
                        this.pageInfo.total = res.data.total;
                    } else {
                        this.$message.error(res.message);
                    }
                }, (error) => {
                    this.loading = false;
                    console.log(error);
                });
            },
            getFileDataByType() {
                getFileListByType({
                    type: this.fileType,
                    currentPage: this.pageInfo.currentPage,
                    pageSize: this.pageInfo.pageSize
                }).then((res) => {
                    this.loading = false;
                    if (res.success) {
                        this.tableData = res.data.list;
                        this.pageInfo.total = res.data.total;
                    } else {
                        this.$message.error(res.message);
                    }
                }, (error) => {
                    this.loading = false;
                    console.log(error);
                });
            },
            changePageInfo(pageInfo) {
                this.pageInfo.currentPage = pageInfo.currentPage;
                this.pageInfo.pageSize = pageInfo.pageSize;
                this.getFileData();
            },
            handleUploadFile() {
                // 触发子组件中的打开文件上传窗口事件
                this.$refs.fileUploader.triggerSelectFileClick();
            },
            /**
             * 设置移动文件时的文件信息
             * @param {Boolean} isBatch 是否批量移动，true 是批量移动，false 是单个文件操作
             * @param {Object | Array} file 需要移动的文件信息，单个操作时为Oject，批量操作时，为Array
             */
            setOperationFile(isBatch, file) {
                this.isBatch = isBatch; //  保存操作类型
                if (isBatch) {
                    this.operationFileList = file; //  批量操作文件
                } else {
                    this.operationFile = file; //  单个操作文件
                }
            },
            /**
             * 设置移动文件对话框相关数据
             * @param {Boolean} visible 打开/关闭移动文件模态框
             */
            setMoveFileDialog(visible) {
                this.moveFileDialog.visible = visible; //  打开对话框
                if (visible) {
                    // 打开对话框时，获取文件夹目录树
                    getFileTree().then((res) => {
                        if (res.success) {
                            this.moveFileDialog.fileTree = [res.data];
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                }
            },
            //  设置移动文件的目标路径
            setSelectFilePath(selectFilePath) {
                this.selectFilePath = selectFilePath;
            },
            //  移动文件模态框-确定按钮事件
            confirmMoveFile() {
                if (this.isBatch) {
                    //  批量移动
                    let data = {
                        newPath: this.selectFilePath,
                        files: JSON.stringify(this.operationFileList)
                    };
                    batchMoveFile(data).then((res) => {
                        if (res.success) {
                            this.getFileData();
                            this.moveFileDialog.visible = false;
                            this.operationFileList = [];
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                } else {
                    //  单文件移动
                    let data = {
                        newPath: this.selectFilePath, //  目标路径
                        id: this.operationFile.id
                    };
                    moveFile(data).then((res) => {
                        if (res.success) {
                            this.$message.success("移动文件成功");
                            this.getFileData(); //  刷新文件列表
                            this.moveFileDialog.visible = false; //  关闭对话框
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                }
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .home
        display flex

        .home-left
            box-sizing border-box

        .home-right
            box-sizing border-box
            width calc(100% - 200px)
            padding 8px 24px
            flex 1

            .operation-wrapper
                margin-bottom 16px
                display flex
                align-items center
                justify-content space-between

                >>> .operation-menu-wrapper
                    flex 1
</style>