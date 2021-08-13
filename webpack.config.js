const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const pathsToClean = ['dist']

const cleanOptions = {
  exclude: ['_redirects'],
  verbose: true,
  dry: false,
}

module.exports = (env, options) => {
  return {
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(gif|png|jpe?g|svg|mp4|mp3)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true, // webpack@2.x and newer
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js'],
    },
    output: {
      filename: '[name].[hash].js',
    },
    devServer: {
      publicPath: '/',
      historyApiFallback: true,
    },
    devtool: 'eval-source-map',
    plugins: [
      new Dotenv(),

      new CleanWebpackPlugin(pathsToClean, cleanOptions),
      new HtmlWebpackPlugin({
        title: 'The Square Community',
        description: '',
        site_url: '',
        template: './templates/index.html',
      }),
      new CopyWebpackPlugin([{ from: './assets/**/*', to: './' }]),
    ],
  }
}
