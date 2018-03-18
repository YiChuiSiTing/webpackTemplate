var isProd = process.env.NODE_ENV === 'production';
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin');

//分别环境是否加载制定插件

// var cssConfig = isProd ? cssProd : cssDev;//区分css 环境
// var cssDev = ['style-loader', 'css-loader', 'sass-loader'];
// var cssProd = ExtractTextPlugin.extract({
//   fallback: 'style-loader',
//   //resolve-url-loader may be chained before sass-loader if necessary
//   use: ['css-loader', 'sass-loader']
// })
//

//添加bootstrap

const bootstrapEntryPoints = require('./webpack.bootstrap.config')
var bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;








//在为生产环境编译文件的时候，先把 build或dist (就是放生产环境用的文件) 目录里的文件先清除干净，再生成新的
var HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
let pathsToClean = [
  'dist',
]
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  // entry: './src/app.js',
  devtool: 'source-map',//方便调试
  entry: {
    "app.bundle": './src/app.js',
    "contact": './src/contact.js',
    "bootstrap": bootstrapEntryPoints.prod
  },
  output: {
    // path: __dirname + '/dist',
    // filename: 'app.bundle.js'
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js' //devServer.hot 开启时
    //filename: '[name].[chunkhash].js' //devServer.hot 关闭时
  },
  devServer: {
    port: 9000,
    open: true,//自动打开浏览器,
    hot: true,//使用模块热替换 HMR 来处理 CSS
  },
  plugins: [
    new HtmlWebpackPlugin({

      //title:"webpackproject",//修改title
      template: './src/index.html',//
      //filename:'index1.html', //修改dist文件title
      minify: {
        collapseWhitespace: true,//去掉空格
      },
      hash: true,//加cache
      excludeChunks: ['contact']//excludeChunks 指的是不包含
    }),
    new HtmlWebpackPlugin({
      template: './src/contact.html',
      filename: 'contact.html',
      minify: {
        collapseWhitespace: true,
      },
      hash: true,
      chunks: ['contact']
    }),

    // new HtmlWebpackPlugin({
    //   template: './src/pug.pug',//添加pug模板
    // }),

    //new ExtractTextPlugin('style.css'),未启用HMR
    new CleanWebpackPlugin(pathsToClean),
    //使用模块热替换 HMR 来处理 CSS
    new ExtractTextPlugin({
      filename: 'style.css',
      // disable: !isProd,
      disable: true,
      publicPath: 'css/'// css 文件放到 css 目录中
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    //启用HMR之后 ExtractTextPlugin 需要添加disabled：true
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),//引入第三方jQ插件
  ],
  module: {

    rules: [
      {
        test: /\.(woff2?|svg)$/,
        loader: 'url-loader?limit=10000&name=[name].[ext]&outputPath=fonts/'
      },
      {
        test: /\.(ttf|eot)$/,
        loader: 'file-loader?name=[name].[ext]&outputPath=fonts/'
      },
      {
        test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
        loader: 'imports-loader?jQuery=jquery'
      },//添加jQuery

      //解析css|scss
      // {
      //   test: /\.(css|scss)$/,
      //   use: [ 'style-loader', 'css-loader','sass-loader']//使用loader处理css
      // }
      //


      //extract-text-webpack-plugin   把 SASS 或 CSS 处理好后，放到一个 CSS 文件

      //未启用HMR
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          //use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
          use: ['css-loader', 'sass-loader']
        })
      },


      //启用HMR
      // {
      //   test: /\.(css|scss)$/,
      //   use: cssConfig
      // },
      //

      { test: /\.(js|jsx|mjs)$/, loader: 'babel-loader', exclude: /node_modules/ },//使用loader 来转化 react 的代码
      { test: /\.pug$/, loader: ['raw-loader', 'pug-html-loader'] },//pug模板
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }//去掉option 为图片加上hash值
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            }
          },//压缩图片
        ]
      },//处理图片文件
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }],//把 html 变成导出成字符串的过程中，还能进行压缩处理（minimized）
      }
    ]
  }
};