export default function install(Vue) {
    //  加载缩略图
    Vue.prototype.downloadImgMin = function (fileUrl) {
        let index = fileUrl.lastIndexOf(".");
        fileUrl = "api/" + fileUrl.substr(0, index) + "_min.png";
        return fileUrl;
    };
}
