const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    mode: "production",//构建环境
    output: {
        filename: '[id].[name].[hash:8].js', //添加哈希字符串，添加唯一标识id
        path: path.resolve(__dirname, 'dist'),//必须是绝对路径
        publicPath:"", //资源路径的相对url，例如引用cdn的资源
    },
    plugins: [
        new HtmlWebpackPlugin({        //html 模板加载功能，它自动引入打包后的js,css
            title: "基础测试",
            filename:'index.html',  //打包后的html文件名
            template: "index.html", //指定模板后，title等属性可能不起作用。
            inject: true, //将脚本放在body最后，可以放在head
            favicon: "", //网站图标的路径，相对路径
            meta: { //插入meta标签。
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }, 
            base: false, //注入base 标签，为页面上的所有链接规定默认地址或默认目标。
            minify: false, //生产环境下自动为true
        }),
        new CleanWebpackPlugin({         // 清理dist文件夹，webpack官方文档已过时。。。
            //模拟文件的删除，默认false
            dry: false,
            //向控制台打印日志，默认false
            verbose: true,
            // 重新构建时自动删除所有webapack未使用的资源(assets,即构建后的所有文件)，默认 true
            cleanStaleWebpackAssets: true,
            // 不允许删除当前的webpack资源，默认true
            protectWebpackAssets: true
        })
    ]
};