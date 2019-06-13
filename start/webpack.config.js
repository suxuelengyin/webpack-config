const path = require('path')
const basic = require('../basic.config.js')
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { fileDisplay } = require('../utils/webpack.utils.js')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')

// console.log(fileDisplay(__dirname))
const config = merge({
    entry: [path.resolve(__dirname, './src/index.js')],
    output: {
        filename: '[id].[name].[hash:8].js', //添加哈希字符串，添加唯一标识id
        path: path.resolve(__dirname, 'dist'),//必须是绝对路径
        publicPath: "./", //资源路径的相对url，例如引用cdn的资源
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath:'assets/'
                        }
                    }
                ]
            },
        ]
    },
    devServer: {
        contentBase: false,
        publicPath: "/",
        hot: true, // 模块热替换
        inline: true, // 自动刷新浏览器
    },
    devtool: "cheap-module-source-map", // start启动时，开启map文件生成，以方便调试
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'index.html'),
            title: "基础测试",
            inject: true, //将脚本放在body最后，可以放在head
            favicon: "", //网站图标的路径，相对路径
            meta: { //插入meta标签。
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            },
            base: false, //注入base 标签，为页面上的所有链接规定默认地址或默认目标。
            minify: false, //生产环境下自动为true
        }),
        new ErrorOverlayPlugin(),
    ]
}, basic)
module.exports = config
