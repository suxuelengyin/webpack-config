
'use strict';

const config = require('../webpack.config.js')
const webpack = require('webpack')
const chalk = require('chalk')
webpack(config)
    .run((err, stats) => {
        if (err) {
            console.log(chalk.bold.red('err'))
        } else {
            console.log(chalk.bold.blue('build success!!!'))
        }
    })