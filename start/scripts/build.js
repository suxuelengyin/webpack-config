
'use strict';

const config = require('../webpack.config.js')
const webpack = require('webpack')
const chalk = require('chalk')
// 打包时将环境设置为生产环境
config.mode = "production"
webpack(config)
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
