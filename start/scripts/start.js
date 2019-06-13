
'use strict';

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config');
const openBrowser = require('../../utils/openBrowser')
const { clearConsole } = require('../../utils/webpack.utils')
const merge = require('webpack-merge');
const chalk = require('chalk')
const errorOverlayMiddleware = require('../../utils/errorOverlay')
const evalSourceMapMiddleware = require('../../utils/evalSourceMapMiddleware');


// 开发时将环境设置为开发环境
config.mode = "development"

// start 时不清理dist文件夹
const compiler = Webpack(merge({
}, config));

// 创建 webpack 核心 compiler, 添加钩子函数
const createCompiler = (compiler) => {
    // 是不是第一次构建，文件变更构建就不会执行
    let isFirst = true
    compiler.hooks.compile.tap('compile', () => {
        if (isFirst) {
            isFirst = false
            console.log(chalk.cyan('starting the development server...\n'));
        }
    })
    compiler.hooks.done.tap('done', () => {
        if (isFirst) {
            console.log(chalk.cyan('localhost: http://localhost:8080'));
            // openBrowser("http://localhost:8080");
        }

    })
    // 文件未改动，编译无效时
    compiler.hooks.invalid.tap('invalid', () => {
        clearConsole()
    })
    return compiler
}



const devServerOptions = Object.assign({}, config.devServer, {
    before(app, server) {
        //   if (fs.existsSync(paths.proxySetup)) {
        //     // This registers user provided middleware for proxy reasons
        //     require(paths.proxySetup)(app);
        //   }

        // This lets us fetch source contents from webpack for the error overlay
        app.use(evalSourceMapMiddleware(server));
        // This lets us open files from the runtime error overlay.
        app.use(errorOverlayMiddleware());

        // This service worker file is effectively a 'no-op' that will reset any
        // previous service worker registered for the same host:port combination.
        // We do this in development to avoid hitting the production cache if
        // it used the same host and port.
        // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
        app.use(createNoopServiceWorkerMiddleware());
    },
    open: false,
    clientLogLevel: "none",
    historyApiFallback: true,
    hot: true,
    stats: "errors-only",
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
});
function createNoopServiceWorkerMiddleware() {
    return function noopServiceWorkerMiddleware(req, res, next) {
        if (req.url === '/service-worker.js') {
            res.setHeader('Content-Type', 'text/javascript');
            res.send(
                `// This service worker file is effectively a 'no-op' that will reset any
// previous service worker registered for the same host:port combination.
// In the production build, this file is replaced with an actual service worker
// file that will precache your site's local assets.
// See https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', () => {
  self.clients.matchAll({ type: 'window' }).then(windowClients => {
    for (let windowClient of windowClients) {
      // Force open pages to refresh, so that they have a chance to load the
      // fresh navigation response from the local dev server.
      windowClient.navigate(windowClient.url);
    }
  });
});
`
            );
        } else {
            next();
        }
    };
};