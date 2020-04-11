const path = require('path')

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  mode: 'production',
  entry: {
    index: path.join(__dirname, './index.js')
  },
  output: {
    path: path.resolve(__dirname, '../client-dist'),
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
    // libraryTarget: 'window',
    // library: ['Vant', '[name]']
  },
  externals: {
    vue: 'Vue'
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js(x)?$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ]
    // minimize: false
    // splitChunks: {
    //   // include all types of chunks
    //   chunks: 'all'
    // }
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './index.html')
    })
  ]
})
