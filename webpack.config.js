const path = require('path')
const fs = require('fs')
const merge = require('webpack-merge');
const webpack = require('webpack')
const { fileDisplay } = require('./utils/webpack.utils.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const BaseConfig = require('./webpack.base')

const basePath = path.resolve(__dirname, 'src')
const basePathArray = [basePath]
const isDir = (file) => {
    return fs.statSync(file).isDirectory()
}

const getStats = (basePath = "") => {
    const fileNameArray = fs.readdirSync(basePath)
    return fileNameArray.reduce((pre, fileName, index) => {
        let stats = {}
        stats.basePath = basePath
        stats.name = basePath + '/' + fileName
        stats.isDir = isDir(stats.name)
        if (fileName === "webpack.suxue.js") {
            stats.config = require(stats.name)
            stats.config.basePath = basePath
        }
        if (stats.isDir) {
            basePathArray.push(stats.name)
            stats.children = getStats(stats.name)
        }
        pre.push(stats)
        return pre
    }, [])
}

const getConfig = (stats) => {
    return stats.reduce((pre, now) => {
        let list = []
        if (now.config) {
            list = [now]
        }
        if (now.children) {
            list = getConfig(now.children)
        }
        return [...pre, ...list]
    }, [])
}
const getStatsArray = (stats) => {
    return stats.reduce((pre, now) => {
        if (now.children) {
            now = getStatsArray(now.children)
        }
        if (now.length) {
            return [...pre, ...now]
        } else {
            pre.push(now)
            return pre
        }
    }, [])
}
const getPath = (basePath, name) => {
    return name.split(basePath)[1]
}
const stats = getStats(basePath)
const configStats = getConfig(stats)
const StatsArray = getStatsArray(stats)
const mergeConfig = (StatsArray = []) => {
    const config = basePathArray.map((item) => {
        const configObj = StatsArray.filter(stats => stats.basePath === item).find(item => item.config)||{}
        if (configObj.config) {
            return configObj.config
        } else {
            return {
                basePath: item,
                entry: item + '/index.js',
                output: {
                    filename: '[id].[name].[hash:8].js',
                    path: path.resolve(__dirname, 'dist'+getPath(basePath, item))
                }
            }
        }
    })
    return config
}
const config = mergeConfig()
module.exports = function (env) {
    const isDev = env === "development"
    const isPro = env === "production"
    const configArray = config.map(item=>{
        const basePath = item.basePath
        delete item.basePath
        return merge(item,BaseConfig(env, basePath))
    })
    return configArray
}
