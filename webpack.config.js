module.exports = {
    entry: "./src/extension.ts",
    output: {
        filename: "dist.js",
        path: __dirname + "/dist",
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    mode: "development",
    watch: true,
    devServer: {
        static: '.',
    },
}