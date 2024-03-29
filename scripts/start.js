
'use strict';

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const makeConfig = require('../webpack.config');
const openBrowser = require('../utils/openBrowser')
const { clearConsole } = require('../utils/webpack.utils')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const merge = require('webpack-merge');
const chalk = require('chalk')


// 开发时将环境设置为开发环境
process.env.NODE_ENV = "development"

const config = makeConfig("development")
// start 时不清理dist文件夹
const compiler = Webpack(merge({}, config))


// 创建 webpack 核心 compiler, 添加钩子函数
const createCompiler = (compiler) => {
    // 是不是第一次构建，文件变更构建就不会执行
    let isFirst = true
    compiler.hooks.compile.tap('compile', () => {
        if (isFirst) {
            console.log(chalk.cyan('starting the development server...\n'));
        }
    })
    compiler.hooks.done.tap('done', (stats) => {
        if (isFirst) {
            isFirst = false
            console.log(chalk.cyan('localhost: http://localhost:8080'));
            // openBrowser("http://localhost:8080");
        }
        const statsMessages = formatWebpackMessages(stats.toJson({
            all: false,
            warnings: true,
            errors: true,
        }))
        if (statsMessages.errors.length > 0) {
            console.log(statsMessages.errors[0])
        }

    })
    // 文件未改动，编译无效时
    compiler.hooks.invalid.tap('invalid', () => {
        clearConsole()
    })
    return compiler
}



const devServerOptions = Object.assign({}, config.devServer, {
    open: false,
    clientLogLevel: "none",
    historyApiFallback: true,
    hot: true,
    quiet: true,
    inline: true,
    compress: true,
    overlay: false,
});
const server = new WebpackDevServer(createCompiler(compiler), devServerOptions);
server.listen(8080, '127.0.0.1', (err) => {
    if (err) {
        return console.log(err);
    }
    if (process.env.NODE_PATH) {
        console.log(
            chalk.yellow(
                'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
            )
        );
        console.log();
    }
})