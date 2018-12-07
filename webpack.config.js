
var path = require("path");
var webpack = require("webpack");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var version = require('./package.json').version;

module.exports = {
  entry: "./src/index.jsx",
  node: {
    fs: "empty"
  },
  output: {
    filename: "bundle" + version + ".js",
    chunkFilename: "[name].bundle" + version + ".js",
    publicPath: path.join( __dirname, "out/scripts"),
    path: path.join( __dirname, "out/scripts")
  },
  mode: 'production',
  plugins: [
		new HtmlWebpackPlugin({
      title: 'My App',
      template: './src/index.html',
      filename: "../index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "style" + version + ".css",
      chunkFilename: "something.css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /utils/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
      test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
          },
        ],
      }
    ]
  }
};
