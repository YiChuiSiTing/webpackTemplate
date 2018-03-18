const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: false,
      hash: process.env.NODE_ENV === 'production',
      excludeChunks: ['contact']
    }),
    new HtmlWebpackPlugin({
      template: './src/contact.html',
      filename: 'contact.html',
      minify: false,
      hash: process.env.NODE_ENV === 'production',
      chunks: ['contact']
    }),
    new ExtractTextPlugin({
      publicPath: 'css/',
      filename: '[name].[contenthash].css',
      disable: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          //use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
          use: ['css-loader', 'sass-loader']
        })
      },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.pug$/, loader: ['raw-loader', 'pug-html-loader'] },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
        }]
      },
      { test: /\.woff2?$/, loader: 'url-loader?limit=10000&name=[name].[ext]&outputPath=fonts/' },
      { test: /\.(ttf|eot)$/, loader: 'file-loader?name=[name].[ext]&outputPath=fonts/' },
      { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery' },
    ]
  }
};