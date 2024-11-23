const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");
module.exports = {
    entry: {
        ui: "@framework/ui/waterbox.ts",
        extension: "@framework/entry.ts",
    },
    output: {
        filename: "[name].dist.js",
        path: path.resolve(__dirname, "dist"),
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
    plugins: [new VueLoaderPlugin(), new HtmlWebpackPlugin({
        template: "./index.html",
        filename: "index.html",
        chunks: ["ui"]
    })],
    devServer: {
        static: "./",
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        port: 25565,
        compress: true,
        hot: true
    },
    optimization: {
        runtimeChunk: 'single'
    }
}