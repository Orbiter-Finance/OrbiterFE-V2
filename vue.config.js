const isProduction = process.env.NODE_ENV !== 'development'
const path = require('path')
const NullishCoalescingOperatorPlugin = require('@babel/plugin-proposal-nullish-coalescing-operator')
const LogicalAssignmentOperators = require('@babel/plugin-proposal-logical-assignment-operators')
const NumericSeparator = require('@babel/plugin-proposal-numeric-separator')
const ExportNamespaceFrom = require('@babel/plugin-proposal-export-namespace-from')

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
    config.module
      .rule('mqtt')
      .test(/\.js$/)
      .include.add(path.resolve(__dirname, 'node_modules/mqtt'))
      .add(path.resolve(__dirname, 'node_modules/mqtt-packet'))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        plugins: [LogicalAssignmentOperators],
      })
      .end()
    config.module
      .rule('solana')
      .test(/(\.mjs$)|(\.js$)/)
      .include.add(path.resolve(__dirname, 'node_modules/@solana'))
      .add(path.resolve(__dirname, 'node_modules/@project-serum/anchor'))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        plugins: [
          LogicalAssignmentOperators,
          NumericSeparator,
          ExportNamespaceFrom,
        ],
      })
      .end()
    config.module
      .rule('aptos')
      .test(/(\.mjs$)|(\.js$)/)
      .include.add(path.resolve(__dirname, 'node_modules/@aptos-labs/ts-sdk'))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        plugins: [LogicalAssignmentOperators],
      })
      .end()
    config.module
      .rule('ton')
      .test(/\.js$/)
      .include.add(path.resolve(__dirname, 'node_modules/tonweb'))
      .add(path.resolve(__dirname, 'node_modules/@tonconnect'))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        plugins: [LogicalAssignmentOperators],
      })
      .end()
    config.module
      .rule('starknet')
      .test(/(\.mjs$)|(\.js$)/)
      .include.add(resolve('node_modules/starknet'))
      .add(resolve('node_modules/@scure'))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        plugins: [NullishCoalescingOperatorPlugin],
      })
      .end()
    config.module
      .rule('walletconnect')
      .test(/\.js$/)
      .include.add(resolve('node_modules/@walletconnect'))
      .add(resolve('node_modules/viem'))
      .add(resolve('node_modules/@wagmi'))
      .add(resolve('node_modules/@web3modal'))
      .add(resolve('node_modules/@noble'))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        plugins: [NullishCoalescingOperatorPlugin],
      })
      .end()
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
            default: false,
            vendors: false,
            vendor: {
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              minSize: 1000000,
              maxSize: 3000000,
            },
            common: {
              chunks: 'all',
              test: /[\\/]src[\\/]js[\\/]/,
              name: 'common',
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
