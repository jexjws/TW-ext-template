const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const WebpackBar = require("webpackbar");
const path = require("path");
const serverConfig = require("./config/server");
const commonConfig = require("./config/webpack");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    ...commonConfig.staticShow,
    entry: "@framework/ui/waterbox.ts",
    output: {
        filename: `${serverConfig.waterBox.output}.dist.js`,
        path: path.resolve(__dirname, `dist/${serverConfig.waterBox.output}`),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.vue$/i,
                use: "vue-loader"
            },
            {
                test: /\.css$/i,
                use: ["vue-style-loader", "css-loader"]
            },
            ...commonConfig.loaderRule
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
        }),
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: [
                    `[WaterBox] Debugger is running on http://127.0.0.1:${serverConfig.waterBox.port}`
                ]
            }
        })
    ],
    devServer: {
        ...commonConfig.devServer,
        port: serverConfig.waterBox.port,
    }
};