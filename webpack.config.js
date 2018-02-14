const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const TARGET = 'cambridge-dictionary'

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

deleteFolderRecursive(TARGET)

const config = {
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, TARGET),
  },
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new CopyWebpackPlugin([
      {from: 'icon.png', to: path.join(__dirname, TARGET)},
      {from: 'index.css', to: path.join(__dirname, TARGET)},
      {from: 'manifest.json', to: path.join(__dirname, TARGET)},
    ])
  ],
}
module.exports = config