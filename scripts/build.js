
'use strict';

const config = require('../webpack.config.js')
const webpack = require('webpack')
const chalk = require('chalk')
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// 打包时将环境设置为生产环境
// config.mode = "production"

const productionConfig = {
    plugins: [
        new CleanWebpackPlugin({         // 清理dist文件夹，webpack官方文档已过时。。。
            //模拟文件的删除，默认false
            dry: false,
            //向控制台打印日志，默认false
            verbose: false,
            // 重新构建时自动删除所有webapack未使用的资源(assets,即构建后的所有文件)，默认 true
            cleanStaleWebpackAssets: true,
            // 不允许删除当前的webpack资源，默认true
            protectWebpackAssets: true
        }),
    ]
}

webpack(merge(productionConfig, config("production")))
    .run((err, stats) => {
        if (err) {
            console.log(chalk.bold.red('err'))
        } else {
            const info = stats.toJson();

            if (stats.hasErrors()) {
                console.error(info.errors[0]);
            }

            if (stats.hasWarnings()) {
                console.warn(info.warnings);
            }
            console.log(chalk.bold.blue('build success!!!'))
        }
    })
