const WebpackBar = require("webpackbar");
const path = require("path");
const serverConfig = require("./config/server");
const commonConfig = require("./config/webpack");
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    entry: "@framework/entry.ts",
    output: {
        filename: `${serverConfig.extension.output}.dist.js`,
        path: path.resolve(__dirname, `dist/${serverConfig.extension.output}`),
        clean: true
    },
    module: {
        rules: [
            ...commonConfig.loaderRule,
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: [...commonConfig.fileExtensions],
        alias: commonConfig.alias
    },
    plugins: [
        new WebpackBar({
            name: "Extension",
            color: "green"
        })
    ],
    devServer: {
        ...commonConfig.devServer,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        port: serverConfig.extension.port,
        hot: false,
        liveReload: false,
        webSocketServer: false
    }
}