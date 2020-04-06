const path = require('path')

const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    editor: path.resolve(__dirname, '../src/pages/editor/index.js'),
    demo: path.resolve(__dirname, '../src/pages/demo/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js'
  },
  externals: {
    vue: 'Vue'
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src')
    },
    extensions: [
      '.mjs',
      '.js',
      '.jsx',
      '.vue',
      '.json',
      '.wasm'
    ]
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
        loader: 'babel-loader',
        options: {
          presets: ['@vue/babel-preset-jsx']
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: require('sass')
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          /* config.module.rule('fonts').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin(
      {
        title: 'Editor',
        chunks: [
          'chunk-vendors',
          'chunk-common',
          'editor'
        ],
        template: path.join(__dirname, '../public/index.html'),
        filename: 'editor.html'
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'Demo',
        chunks: [
          'chunk-vendors',
          'chunk-common',
          'demo'
        ],
        template: path.join(__dirname, '../public/index.html'),
        filename: 'demo.html'
      }
    ),
    new CopyPlugin(
      [
        {
          from: path.join(__dirname, '../public'),
          to: path.join(__dirname, '../dist'),
          toType: 'dir',
          ignore: [
            '.DS_Store',
            {
              glob: 'index.html',
              matchBase: false
            },
            {
              glob: 'index.html',
              matchBase: false
            }
          ]
        }
      ]
    ),
    new webpack.DefinePlugin(
      {
        'process.env': {
          NODE_ENV: `"${process.env.NODE_ENV}"`,
          BASE_URL: '"/"'
        }
      }
    )
  ]
}
