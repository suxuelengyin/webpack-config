const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
const env = process.env.NODE_ENV

module.exports = {
    // 各种 loader
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader'
                ]
            },
        ]
    },
    plugins: [
        new ProgressBarPlugin({
            format: '  build [:bar] :percent (:elapsed seconds)',
            clear: true,
            width: 60
        }),
        // npm start 时不需要清理
        env === "production" ? new CleanWebpackPlugin({         // 清理dist文件夹，webpack官方文档已过时。。。
            //模拟文件的删除，默认false
            dry: false,
            //向控制台打印日志，默认false
            verbose: false,
            // 重新构建时自动删除所有webapack未使用的资源(assets,即构建后的所有文件)，默认 true
            cleanStaleWebpackAssets: true,
            // 不允许删除当前的webpack资源，默认true
            protectWebpackAssets: true
        }) : "",
        new MiniCssExtractPlugin({
            // 和 webpackOptions.output 配置相同
            // both options are optional
            filename: 'index.css',
            chunkFilename: '[id].css',
        })
    ].filter(item => item),
};