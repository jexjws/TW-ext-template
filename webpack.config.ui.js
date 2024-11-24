const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const WebpackBar = require("webpackbar");
const path = require("path");
const serverConfig = require("./config/server");
module.exports = {
    entry: "@framework/ui/waterbox.ts",
    output: {
        filename: `${serverConfig.waterBox.output}.dist.js`,
        path: path.resolve(__dirname, `dist/${serverConfig.waterBox.output}`),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: "ts-loader"
            },
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
        extensions: [".ts", ".js", ".vue"],
        alias: {
            "@framework": path.resolve(__dirname, "src/fs-context"),
            "@src": path.resolve(__dirname, "src"),
            "@config": path.resolve(__dirname, "config"),
            "@samples": path.resolve(__dirname, "src/fs-context/samples")
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html"
        }),
        new WebpackBar({
            name: "WaterBox",
            color: "blue"
        })
    ],
    devServer: {
        static: "./",
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        port: serverConfig.waterBox.port,
        compress: true,
        hot: true
    }
}