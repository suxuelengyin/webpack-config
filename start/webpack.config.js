const path = require('path')
const basic = require('../basic.config.js')
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = merge({
    entry: './src/index.js',
    mode: "production",//构建环境
    output: {
        filename: '[id].[name].[hash:8].js', //添加哈希字符串，添加唯一标识id
        path: path.resolve(__dirname, 'dist'),//必须是绝对路径
        publicPath: "", //资源路径的相对url，例如引用cdn的资源
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html"
        })
    ]
}, basic)
module.exports = config
