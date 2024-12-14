const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const WebpackBar = require("webpackbar");
const path = require("path");
const serverConfig = require("./config/server");
const commonConfig = require("./config/webpack");
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    entry: "@framework/ui/waterbox.ts",
    output: {
        filename: `${serverConfig.waterBox.output}.dist.js`,
        path: path.resolve(__dirname, `dist/${serverConfig.waterBox.output}`),
        clean: true
    },
    module: {
        rules: [
            ...commonConfig.loaderRule,
            {
                test: /\.vue$/i,
                use: "vue-loader"
            },
            {
                test: /\.css$/i,
                use: ["vue-style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: [...commonConfig.fileExtensions, ".vue"],
        alias: commonConfig.alias
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
        }),
        new WebpackBar({
            name: "WaterBox",
            color: "blue"
        })
    ],
    devServer: {
        ...commonConfig.devServer,
        port: serverConfig.waterBox.port,
    }
};