const path = require('path')
const webpack = require('webpack')

const config = require('./webpack.config')

config.devServer = {
  contentBase: path.join(__dirname, '../dist'),
  compress: true,
  port: 9000,
  hot: true
}

config.plugins.push(
  new webpack.HotModuleReplacementPlugin()
)

module.exports = config
