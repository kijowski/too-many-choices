const common = require('./webpack.common.config')
const merge = require('webpack-merge')
const TesterPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [new TesterPlugin(), new OptimizeCSSAssetsPlugin()]
  }
})
