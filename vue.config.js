const isProduction = process.env.NODE_ENV !== 'development'
const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    indexPath: 'index.html',
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.plugin('html').tap((args) => {
            args[0].title = 'Orbiter'
            return args
        })
        config.externals({
            web3: 'Web3',
        })
        // set svg-sprite-loader
        config.module.rule('svg').exclude.add(resolve('src/icons')).end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            })
            .end()
    },
    css: {
        extract: true,
        sourceMap: false,
        loaderOptions: {
            less: {
                lessOptions: {
                    // If you are using less-loader@5 please spread the lessOptions to options directly
                    modifyVars: {
                        'primary-color': '#F85F53',
                        'link-color': '#321987',
                        'border-radius-base': '1rem',
                        'radio-button-bg': 'clear',
                        'radio-button-checked-bg': '#F85F53 !important',
                        'radio-button-color': 'black',
                        'radio-button-active-color': 'white',
                    },
                    javascriptEnabled: true,
                },
            },
        },
        // modules: false
    },
    devServer: {
        disableHostCheck: true,
        open: true,
        host: '0.0.0.0',
        port: 8080,
        hot: true,
        proxy: {
            '/send': {
                target: 'https://TEST.execute-api.ap-northeast-1.amazonaws.com',
                secure: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/send': '',
                },
            },
            '/api/v1/l2_data': {
                // target: 'https://l2api.orbiter.finance/',
                target: 'http://datastation.joeyzhou.xyz/',
                changeOrigin: true,
            },
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        overlay: {
            warnings: false,
            errors: false,
        },
    },
    configureWebpack: (config) => {
        Object.assign(config.resolve, {
            alias: {
                '@': resolve(__dirname, './src'),
                assets: resolve(__dirname, './src/assets'),
                common: resolve(__dirname, './src/common'),
                components: resolve(__dirname, './src/components'),
                config: resolve(__dirname, './src/config'),
                views: resolve(__dirname, './src/views'),
            },
            extensions: ['.js', '.vue', '.json'],
        })

        if (isProduction) {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
            config.optimization = {
                splitChunks: {
                    cacheGroups: {
                        vendor: {
                            chunks: 'all',
                            test: /node_modules/,
                            name: 'vendor',
                            minChunks: 1,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 100,
                        },
                        common: {
                            chunks: 'all',
                            test: /[\\/]src[\\/]js[\\/]/,
                            name: 'common',
                            minChunks: 2,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 60,
                        },
                        styles: {
                            name: 'styles',
                            test: /\.(sa|sc|c)ss$/,
                            chunks: 'all',
                            enforce: true,
                        },
                        runtimeChunk: {
                            name: 'manifest',
                        },
                    },
                },
            }
        } else {
            config.devtool = 'source-map'
        }
    },
    pluginOptions: {
        // ...
    },
}
