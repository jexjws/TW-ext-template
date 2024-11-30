const WebpackBar = require("webpackbar");
const path = require("path");
const serverConfig = require("./config/server");
module.exports = {
    entry: "@framework/entry.ts",
    output: {
        filename: `${serverConfig.extension.output}.dist.js`,
        path: path.resolve(__dirname, `dist/${serverConfig.extension.output}`),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: "ts-loader"
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(html|md)$/i,
                use: "raw-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            "@framework": path.resolve(__dirname, "src/fs-context"),
            "@src": path.resolve(__dirname, "src"),
            "@config": path.resolve(__dirname, "config"),
            "@samples": path.resolve(__dirname, "src/fs-context/samples")
        }
    },
    plugins: [
        new WebpackBar({
            name: "Extension",
            color: "green"
        })
    ],
    devServer: {
        static: "./",
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        port: serverConfig.extension.port,
        compress: true,
        hot: false,
        liveReload: false,
        webSocketServer: false,
        client: {
            overlay: false
        }
    }
}