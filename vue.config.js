// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
const productConfig = require("./public/cloud.config.json");
module.exports = {
    publicPath: "/",
    devServer: {
        host: "localhost", // 服务端ip
        port: 8080,
        open: false, // 不直接弹出网页
        proxy: {
            // 只有"/api/...." 才使用代理
            "/api": {
                target: productConfig.baseUrl,
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    // 请求时将"/api"去掉
                    "^/api": "/",
                }
            }
        }
    }
};
