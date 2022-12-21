const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const autoprefixer = require('autoprefixer');
const devMode = process.env.NODE_ENV !== 'production'

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins() { return [ new autoprefixer({ browsers: 'last 3 versions' })]; },
    sourceMap: true,
  }
};

const cssloader = {
  loader: 'css-loader',
  options: {
    minimize: true
  }
};

module.exports = {
  entry: ['babel-polyfill', path.join(__dirname, './src/index.js')],
  output: {
    path: __dirname + '/dist',
    filename: 'output.js'
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
        use: {
          loader: "babel-loader",
          options: {  
            cacheDirectory: true  
          }  
        }
      },
      {
        test: /\.(jpe?g|ico|png|gif|eot|woff|woff2|ttf|svg)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "images/"
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
           MiniCssExtractPlugin.loader,
          cssloader,
           postcss,
          'sass-loader',
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "index.html"
    }),
    new CopyWebpackPlugin([{from: "src/js/*.js", flatten: true}]),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.optimize.ModuleConcatenationPlugin()

  ],
  devServer: {   
    port: 9000,
    contentBase: "./dist", 
    headers: {
      "Cache-Control": "max-age=600"
    }
  }  
};
