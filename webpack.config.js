var path = require("path");
const TerserPlugin = require('terser-webpack-plugin');

var PATHS = {
  entryPoint: path.resolve(__dirname, 'src/index.ts'),
  bundles: path.resolve(__dirname, 'dist'),
}

var config = {
  entry: {
    'my-lib': [PATHS.entryPoint],
    'my-lib.min': [PATHS.entryPoint]
  },
  output: {
    path: PATHS.bundles,
    filename: '[name].js',
    // libraryTarget: 'umd',
    // library: 'wmu',
    // umdNamedDefine: true
  },
  resolve: {
    extensions: ['.ts']
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
    ]
  },
  optimization: {
      minimize: true,
      minimizer: [
          new TerserPlugin({
              include: /\.min\.js$/,
              sourceMap: true
          })
      ]
  }
}

module.exports = config;