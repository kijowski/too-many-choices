const common = require('./webpack.common.config')
const merge = require('webpack-merge')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: './dist',
    port: 8999,
    // host: '0.0.0.0',
    https: {
      key: './localhost.key',
      cert: './localhost.crt'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
