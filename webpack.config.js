const path = require('path')
const merge = require('webpack-merge');
const webpack = require('webpack')
const { fileDisplay } = require('./utils/webpack.utils.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

console.log(path.resolve(__dirname))
module.exports = function (env) {
    const isDev = env === "development"
    const isPro = env === "production"
    return {
        mode: env,
        entry: [path.resolve(__dirname, './src/index.js')],
        output: {
            filename: '[id].[name].[hash:8].js', //添加哈希字符串，添加唯一标识id
            path: path.resolve(__dirname, 'dist'),//必须是绝对路径
            publicPath: "./", //资源路径的相对url，例如引用cdn的资源
        },
        // 解析
        resolve: {
            // 解析别名，让引入更加简单
            alias: {
                "@": path.resolve(__dirname)
            }
        },
        devServer: {
            contentBase: false,
            publicPath: "/",
            hot: true, // 模块热替换
            inline: true, // 自动刷新浏览器
        },
        devtool: "cheap-module-source-map", // start启动时，开启map文件生成，以方便调试
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
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'assets/'
                            }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        'babel-loader'
                    ]
                }
            ]
        },
        plugins: [
            isDev && new ErrorOverlayPlugin(),
            new webpack.DefinePlugin({
                // 'process.env.NODE_ENV': "Development"
            }),
            new ProgressBarPlugin({
                format: 'building [:bar] :percent (:elapsed seconds)',
                clear: true,
                width: 60
            }),
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
            new MiniCssExtractPlugin({
                // 和 webpackOptions.output 配置相同
                // both options are optional
                filename: 'index.css',
                chunkFilename: '[id].css',
            }),
            isPro && new BundleAnalyzerPlugin()
        ].filter(item => item),

    };
}