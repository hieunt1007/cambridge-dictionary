const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')

const TARGET_FOLDER = 'public'

let deleteFolderRecursive = path => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(file => {
      let curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

deleteFolderRecursive(TARGET_FOLDER)

const PATH_FOLDER = path.join(__dirname, TARGET_FOLDER)
const config = {
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, TARGET_FOLDER)
  },
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new CopyWebpackPlugin([
      {from: 'icon.png', to: PATH_FOLDER},
      {from: 'icon48.png', to: PATH_FOLDER},
      {from: 'icon128.png', to: PATH_FOLDER},
      {from: 'popup.html', to: PATH_FOLDER},
      {from: 'icon.png', to: PATH_FOLDER},
      {from: 'index.css', to: PATH_FOLDER},
      {from: 'manifest.json', to: PATH_FOLDER},
      {from: 'options.html', to: PATH_FOLDER},
      {from: 'options.js', to: PATH_FOLDER}
    ]),
    new ZipPlugin({
      path: PATH_FOLDER,
      filename: 'cambridge-dictionary.zip',
      zipOptions: {
        forceZip64Format: true
      }
    }),
    new WebpackBuildNotifierPlugin({
      title: "Build success",
      suppressSuccess: true
    })
  ]
}
module.exports = config
