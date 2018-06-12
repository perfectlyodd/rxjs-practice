module.exports = {
    entry: "./main",
    output: { filename: "app.js" },
    module: {
        rules: [
            {
                test: /.ts$/,
                use: [
                    { loader: "ts-loader" }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    mode: "development"
}