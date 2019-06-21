var path = require('path')
module.exports = {
    entry: path.resolve(__dirname, 'index.js'),
    output: {
        filename: '[id].[name].[hash:8].js',
        path: path.resolve(__dirname, 'dist/start')
    }
}