const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

var settings = {
  libraryName : 'wmu', // name
  entryPoint: path.resolve(__dirname, 'src/index.ts'), // start file 
  bundles: path.resolve(__dirname, 'dist/lib'), // output folder
}

var config = {
  entry: {
    [settings.libraryName + '-lib']: [settings.entryPoint],
    [settings.libraryName + '-lib.min']: [settings.entryPoint]
  },
  output: {
    path: settings.bundles,
    filename: '[name].js',
    libraryTarget: 'umd',
    library: settings.libraryName,
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.ts'],
    fallback: {
      "fs": false
    }
  },
  plugins: [new NodePolyfillPlugin({
    excludeAliases: ['console'],
  }) ],
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
              terserOptions: {
                sourceMap: true
              }
          })
      ]
  }
}

module.exports = config;