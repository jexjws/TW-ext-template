const path = require("path");
/**
 * @type {import("webpack").RuleSetRule}
 */
const loaderRule = [
    {
        test: /\.d\.ts$/i,
        use: "null-loader"
    },
    {
        test: /\.ts$/i,
        use: "ts-loader"
    },
    {
        test: /\.(html|md)$/i,
        use: "raw-loader"
    }
];
const alias = {
    "@framework": path.resolve(__dirname, "src/fs-context"),
    "@src": path.resolve(__dirname, "src"),
    "@config": path.resolve(__dirname, "config"),
    "@samples": path.resolve(__dirname, "src/fs-context/samples")
};
const fileExtensions = [".ts", ".js"];
/**
 * @type {import("webpack-dev-server").Configuration}
 */
const devServer = {
    static: "./",
    client: {
        overlay: false,
        progress: false
    },
    compress: true,
    hot: true,
    liveReload: true,
    webSocketServer: true
};
module.exports = { loaderRule, alias, fileExtensions, devServer };