<!--https://element.eleme.cn/#/zh-CN/component/table-->
<!--https://element.eleme.cn/#/zh-CN/component/table#zi-ding-yi-lie-mo-ban-->
<!--文件展示-->
<!--1. 侧边栏伸缩效果 -->
<!--2. 列收缩和展开状态的切换 -->
<!--3. 结合文件扩展名对常用的文件类型添加图标-->
<template>
    <el-table :data="tableData" class="file-table" height="calc(100vh - 202px)" v-loading="loading"
              @selection-change="handleSelectRow">
        <el-table-column type="selection" width="50" align="center"/>
        <el-table-column label prop="isFolder" width="60" align="center">
            <template slot-scope="scope">
                <img :src="setFileImg(scope.row)" style="width: 30px" alt=""/>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="名称">
            <template slot-scope="scope">
                <div style="cursor: pointer" @click="handleClickFileName(scope.row)">
                    {{ scope.row.extension ? `${scope.row.name}.${scope.row.extension}` : `${scope.row.name}` }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="path" label="原位置" v-if="fileType===5" sortable>
            <template slot-scope="scope">
                <span>{{ scope.row.path }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="extension" label="类型" width="120" v-if="selectedColumnList.includes('type')"
                         sortable>
            <template slot-scope="scope">
                <span>{{
                        scope.row.isFolder === true ? "文件夹" : fileTypeMap[scope.row.extension] || (scope.row.extension ? (scope.row.extension.toUpperCase() + " 文件") : "文件")
                    }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" width="120" v-if="selectedColumnList.includes('size')" sortable>
            <template slot-scope="scope">
                <span>{{ calculateFileSize(scope.row.size) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="deleteTime" label="删除时间" width="150" v-if="fileType===5" sortable/>
        <el-table-column prop="updateTime" label="修改时间" width="150"
                         v-if="selectedColumnList.includes('updateTime')&&fileType!==5"
                         sortable/>
        <el-table-column label="操作" :width="operationIsUnfold?200:100">
            <template slot="header">
                <span>操作</span>
                <i class="el-icon-circle-plus" title="展开" @click="operationIsUnfold=true"/>
                <i class="el-icon-remove" title="折叠" @click="operationIsUnfold=false"/>
            </template>
            <template slot-scope="scope">
                <div class="operation-unfold" v-if="operationIsUnfold">
                    <el-tooltip content="永久性删除" placement="top" v-if="fileType===5">
                        <el-button type="danger" icon="el-icon-delete" circle/>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top" v-if="fileType!==5">
                        <el-button type="text" icon="el-icon-delete"
                                   @click.native="handleClickDelete(scope.row)"/>
                    </el-tooltip>
                    <el-tooltip content="移动" placement="top" v-if="fileType!==5">
                        <el-button type="text" icon="el-icon-position" @click.native="handleClickMove(scope.row)"/>
                    </el-tooltip>
                    <el-tooltip content="重命名" placement="top" v-if="fileType!==5">
                        <el-button type="text" icon="el-icon-edit" @click.native="handleClickRename(scope.row)"/>
                    </el-tooltip>
                    <el-tooltip content="下载" placement="top" v-if="fileType!==5">
                        <el-button type="text" v-if="scope.row.isFolder===false">
                            <a target="_blank" style="display: block;color: inherit"
                               :href="`/api/transfer/download?id=${scope.row.id}`" v-if="scope.row.isFolder===false">
                                <i class="el-icon-download"/>
                            </a>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="恢复" placement="top" v-if="fileType===5">
                        <el-button type="primary" icon="el-icon-magic-stick" circle/>
                    </el-tooltip>
                    <el-tooltip content="打开所在文件夹">
                        <el-button type="text" icon="el-icon-folder-opened" v-if="fileType!==0&&fileType!==5"
                                   @click.native="$router.push({ query: { fileType: 0, filePath: scope.row.path } })"/>
                    </el-tooltip>
                </div>
                <el-dropdown trigger="click" v-else>
                    <el-button size="mini">
                        操作
                        <i class="el-icon-setting"/>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" style="text-align: center">
                        <el-dropdown-item v-if="fileType===5">
                            <el-tooltip content="永久性删除">
                                <i class="el-icon-delete"/>
                            </el-tooltip>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="fileType===5">
                            <el-tooltip content="恢复">
                                <i class="el-icon-magic-stick"/>
                            </el-tooltip>
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="handleClickDelete(scope.row)" v-if="fileType!==5">
                            <el-tooltip content="删除">
                                <i class="el-icon-delete"/>
                            </el-tooltip>
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="handleClickMove(scope.row)" v-if="fileType!==5">
                            <el-tooltip content="移动">
                                <i class="el-icon-position"/>
                            </el-tooltip>
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="handleClickRename(scope.row)" v-if="fileType!==5">
                            <el-tooltip content="重命名">
                                <i class="el-icon-edit"/>
                            </el-tooltip>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.isFolder===false&&fileType!==5">
                            <a target="_blank" style="display: block;color: inherit"
                               :href="`/api/transfer/download?id=${scope.row.id}`">
                                <i class="el-icon-download"/>
                            </a>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="fileType!==0&&fileType!==5"
                                          @click.native="$router.push({ query: { fileType: 0, filePath: scope.row.path } })">
                            <el-tooltip content="打开所在文件夹">
                                <i class="el-icon-folder-opened"/>
                            </el-tooltip>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import {deleteFile, renameFile} from "@/requests/file";

    export default {
        name: "FileTable",
        props: {
            tableData: {
                type: Array,
                required: true
            },
            loading: {
                type: Boolean,
                required: true
            },
            fileType: {
                type: Number,
                required: true
            }
        },
        methods: {
            handleClickDelete(row) {
                // 消息弹框提示用户
                this.$confirm("是否删除 " + (row.extension ? `${row.name}.${row.extension}` : `${row.name}`) + " ？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    showClose: false,
                    type: "warning"
                }).then(() => {
                    deleteFile({id: row.id}).then((res) => {
                        if (res.success) {
                            this.$emit("getTableData");
                            this.$message.success("删除成功");
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                }).catch(() => {
                    this.$message.info("已取消删除");
                });
            },
            handleClickMove(row) {
                this.$emit("handleSelectFile", false, row);
                this.$emit("handleMoveFile", true);
            },
            handleClickRename(row) {
                this.$prompt("请输入文件名", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    inputValue: row.extension ? `${row.name}.${row.extension}` : `${row.name}`,
                    inputPattern: /\S/, //  文件名不能为空
                    inputErrorMessage: "请输入文件名",
                    closeOnClickModal: false,
                    showClose: false
                }).then(({value}) => {
                    let index = value.lastIndexOf(".");
                    let fileName = value;
                    let fileExtension = null;
                    if (!row.isFolder) {
                        fileName = index === -1 ? value : value.substr(0, index);
                        fileExtension = index === -1 ? null : value.substr(index + 1);
                    }
                    renameFile({
                        id: row.id,
                        name: fileName,
                        extension: fileExtension,
                        isFolder: row.isFolder
                    }).then((res) => {
                        if (res.success) {
                            this.$emit("getTableData");
                            this.$message.success("文件已重命名");
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                }).catch(() => {
                    this.$message.info("重命名已取消");
                });
            },
            handleSelectRow(selection) {
                this.$emit("handleSelectFile", true, selection);
            },
            /**
             * 点击文件夹
             * 进行路由跳转
             * 将文件夹路径写入url中
             *
             * @author Joe
             */
            handleClickFileName(row) {
                if (this.fileType === 5) {
                    return;
                }
                if (row.isFolder) {
                    this.$router.push({
                        query: {
                            fileType: 0,
                            filePath: `${row.path}${row.name}/`
                        }
                    });
                } else if (row.extension && ["jpg", "png", "jpeg", "bmp", "tif"].includes(row.extension.toLowerCase())) {
                    let data = {
                        imageVisible: true,
                        imageList: [{
                            url: `/api${row.url}`,
                            downloadLink: `/api/transfer/download?id=${row.id}`,
                            name: row.name,
                            extension: row.extension
                        }],
                        activeIndex: 0
                    };
                    this.$store.commit("setImageViewData", data);
                }
            },
            calculateFileSize(size) {
                if (!size) {
                    return "";
                }
                size = (size / 1024).toFixed(2);
                if (size < 1024) {
                    return size + " KB";
                }
                size = (size / 1024).toFixed(2);
                if (size < 1024) {
                    return size + " MB";
                }
                size = (size / 1024).toFixed(2);
                if (size < 1024) {
                    return size + " GB";
                }
                size = (size / 1024).toFixed(2);
                return size + " TB";
            },
            setFileImg(row) {
                if (row.isFolder) {
                    return this.fileImgMap.fold;
                } else if (row.url && row.extension && ["jpg", "png", "jpeg", "bmp", "tif", "mp4", "mov", "m4a"].includes(row.extension.toLowerCase())) {
                    return this.downloadImgMin(row.url);
                } else {
                    //  可以识别文件类型的文件
                    return (row.extension && this.fileImgMap[row.extension.toLowerCase()]) || this.fileImgMap.other;
                }
            }
        },
        computed: {
            selectedColumnList() {
                return this.$store.getters.selectedColumnList;
            }
        },
        watch: {
            operationIsUnfold(newValue) {
                sessionStorage.setItem("operationIsUnfold", newValue);
            }
        },
        created() {
            this.operationIsUnfold = sessionStorage.getItem("operationIsUnfold") === "true";
        },
        data() {
            return {
                fileTypeMap: {
                    md: "markdown 笔记",
                    txt: "文本文件",
                    exe: "应用程序"
                },
                fileImgMap: {
                    apk: require("@/assets/image/apk.png"),
                    csv: require("@/assets/image/csv.png"),
                    doc: require("@/assets/image/word.png"),
                    docx: require("@/assets/image/word.png"),
                    xls: require("@/assets/image/excel.png"),
                    xlsx: require("@/assets/image/excel.png"),
                    exe: require("@/assets/image/exe.png"),
                    jpg: require("@/assets/image/jpg.png"),
                    fold: require("@/assets/image/folder.png"),
                    gif: require("@/assets/image/gif.png"),
                    html: require("@/assets/image/html.png"),
                    json: require("@/assets/image/json.png"),
                    mp3: require("@/assets/image/mp3.png"),
                    mp4: require("@/assets/image/mp4.png"),
                    other: require("@/assets/image/other.png"),
                    pdf: require("@/assets/image/pdf.png"),
                    pptx: require("@/assets/image/power_point.png"),
                    ppt: require("@/assets/image/power_point.png"),
                    rar: require("@/assets/image/rar.png"),
                    svg: require("@/assets/image/svg.png"),
                    txt: require("@/assets/image/txt.png"),
                    zip: require("@/assets/image/zip.png"),
                    md: require("@/assets/image/md.png")
                },
                operationIsUnfold: true
            };
        }
    };
</script>

<style lang="stylus" scoped>
    @import '~@/assets/style/mixins.styl'

    .file-table
        width 100%

        >>> .el-table__body-wrapper
            setScrollbar(8px)

    .el-icon-circle-plus, .el-icon-remove
        margin-left 8px
        cursor pointer
        font-size 16px

        &:hover
            opacity 0.5
</style>