const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
module.exports = {
    entry: {
        ui: "./src/fs-context/ui/waterbox.ts",
        extension: "./src/fs-context/entry.ts",
    },
    output: {
        filename: "[name].dist.js",
        path: __dirname + "/dist",
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
        extensions: [".ts", ".js", ".vue"]
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