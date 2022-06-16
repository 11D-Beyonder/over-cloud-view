<template>
    <div class="home">
        <side-menu class="home-left" :storage-value="storageValue" :storage-max-value="storageMaxValue" :storage-percentage="storagePercentage"/>
        <div class="home-right">
            <div class="operation-wrapper">
                <operation-menu :fileType="fileType" :filePath="filePath" @getTableData="getFileData"
                                :operationFileList="operationFileList" @handleUploadFile="handleUploadFile"
                                @handleSelectFile="setOperationFile" @handleMoveFile="setMoveFileDialog"
                />
                <display-mode-changer :file-type="fileType"/>
                <column-selector/>
            </div>
            <address-bar :file-type="fileType"/>
            <file-table v-if="((fileType===1||fileType===3)&&displayMode===0)||(fileType!==1&&fileType!==3)"
                        :file-type="fileType"
                        :table-data="tableData" @getTableData="getFileData" :loading="loading"
                        @handleSelectFile="setOperationFile" @handleMoveFile="setMoveFileDialog"
                        @handleVideo="videoPlay" @handleMD="showMarkDown" @handleAudio="audioPlay"
                        @handleCode="handleCode" @handlePdf="handlePdf" @handleClickShare="handleShare"
            />
            <file-grid :file-type="fileType" v-if="(fileType===1||fileType===3)&&displayMode===1"
                       :table-data="tableData"
                       :loading="loading"/>
            <file-pagination :page-info="pageInfo" @changePageInfo="changePageInfo"/>
        </div>
        <file-uploader ref="fileUploader" @getTableData="getFileData"/>
        <move-file-dialog :move-file-dialog="moveFileDialog" @setSelectFilePath="setSelectFilePath"
                          @confirmMoveFile="confirmMoveFile" @handleMoveFile="setMoveFileDialog"/>
        <image-viewer/>
        <el-dialog
            title="预览"
            :visible.sync="dialogVisible"
            width="60%"
            top="10px"
            :before-close="handleClose">
            <span class="player-container" v-show="showVideo">
                <vue-core-video-player :src=videoPath :key=videoPath controls="fixed"></vue-core-video-player>
            </span>
            <span id="audio-container" v-show="showAudio">
                <aplayer :audio="audio" :lrcType="3"/>
            </span>
            <!--            <span slot="footer" class="dialog-footer">-->
            <!--        <el-button @click="dialogVisible = false">取 消</el-button>-->
            <!--        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
            <!--        </span>-->
            <div id="main" v-show="showMD">
                <mavon-editor v-model="mdContent"/>
            </div>
            <span v-show="showCode">
            <codemirror v-model="codeContent" :options="cmOptions"></codemirror>
            </span>
            <span v-show="showPdf">
            <pdf v-for="i in numPages"
                 :key="i"
                 :src="loadingTask"
                 :page="i"
                 style="display: inline-block; width: 100%"></pdf>
            </span>
        </el-dialog>


        <el-dialog title="分享文件" :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="分享码">
                    <el-input v-model="shareUrl" autocomplete="off" placeholder="请设置您的专属分析码"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDoShare">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
import {
    batchMoveFile,
    getDeletedFile,
    getFileListByPath,
    getFileListByType,
    getFileTree,
    moveFile,
    getFileContent, getFileStorage, putShareFile,
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
import pdf from 'vue-pdf';

require("codemirror/mode/clike/clike.js")
require("codemirror/mode/javascript/javascript.js")
require("codemirror/mode/xml/xml.js")
require("codemirror/mode/vue/vue.js")
require("codemirror/mode/python/python.js")
require("codemirror/mode/css/css.js")
require("codemirror/mode/sql/sql.js")
require("codemirror/mode/shell/shell.js")

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
        ColumnSelector,
        pdf
    },
    data() {
        return {
            storageValue: 0,
            storageMaxValue:1,
            storagePercentage:1,
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
            selectFilePath: "",
            videoPath: "",
            showVideo: false,
            dialogVisible: false,
            showMD: false,
            mdContent: "",
            showAudio: false,
            audio: {
                name: '东西（Cover：林俊呈）',
                artist: '',
                url: 'https://cdn.moefe.org/music/mp3/thing.mp3',
                cover: 'https://p1.music.126.net/5zs7IvmLv7KahY3BFzUmrg==/109951163635241613.jpg?param=300y300', // prettier-ignore
                // lrc: 'https://cdn.moefe.org/music/lrc/thing.lrc',
            },
            // code: 'const a = 10',
            cmOptions: {
                // codemirror options
                tabSize: 4,
                mode: 'text/x-java',
                // theme: 'base16-dark',
                lineNumbers: true,
                line: true,
                // more codemirror options, 更多 codemirror 的高级配置...
                collapseIdentical: false,
                highlightDifferences: true
            },
            codeContent: '',
            showCode: false,
            srcPdf: '',
            showPdf: false,
            loadingTask: undefined,
            numPages: 1,
            dialogFormVisible: false,
            shareUrl:'',
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
        this.getStorageSpace();
        this.getFileData();
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    //隐藏所有预览部件
                    this.showVideo = false;
                    this.showMD = false;
                    this.showAudio = false;

                    this.videoPath = "";
                    this.audio.url = 'null';
                    this.showCode = false;
                    this.showPdf = false;
                    console.log(this.audio)
                    done();
                })
                .catch(_ => {
                });
        },
        handleShare(row){
            this.item=row;
            // this.shareUrl=row.id;
            this.dialogFormVisible=true;
        },
        handleDoShare(){
            this.dialogFormVisible = false;
            putShareFile({userFileId:this.item.id,urlkey:this.shareUrl}).then((res) => {
                // console.log(res)
                // this.storageValue=res.data.storage_used;
                // this.storageMaxValue=res.data.storage_total;
                // this.storagePercentage=(this.storageValue / this.storageMaxValue) * 100;
            });
        },
        getStorageSpace(){
            getFileStorage().then((res) => {
                console.log(res)
                this.storageValue=res.data.storage_used;
                this.storageMaxValue=res.data.storage_total;
                this.storagePercentage=(this.storageValue / this.storageMaxValue) * 100;
            });

        },
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
        videoPlay(url) {
            this.videoPath = url;
            this.showVideo = true;
            this.dialogVisible = true;
            console.log(this.videoPath);
        },
        audioPlay(row) {
            this.audio.url = "http://121.4.251.57:8081/" + row.url;
            this.audio.name = row.name;
            this.audio.artist = '';
            this.audio.cover = 'https://p1.music.126.net/5zs7IvmLv7KahY3BFzUmrg==/109951163635241613.jpg?param=300y300',

                this.showAudio = true;
            this.dialogVisible = true;
            console.log(this.audio);
        },
        showMarkDown(ob) {
            console.log(ob)
            this.showMD = true;
            this.dialogVisible = true;
            getFileContent({id: ob.id}).then((res) => {
                // console.log(res)
                this.mdContent = res;
            });
        },
        handleCode(ob) {
            this.showCode = true;
            this.dialogVisible = true;
            getFileContent({id: ob.id}).then((res) => {
                // console.log(res)
                this.codeContent = res;
            });
        },
        handlePdf(row) {
            this.showPdf = true;
            this.dialogVisible = true;
            this.loadingTask = pdf.createLoadingTask("http://121.4.251.57/api/" + row.url);
            this.loadingTask.promise.then((pdf) => {
                this.numPages = pdf.numPages;
                console.log(loadingTask.numPages)
                console.log(this.numPages)
            })


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

    .player-container {
        //position: absolute
        //top 20%
        //left 20%
        //width 60%
    }
</style>
