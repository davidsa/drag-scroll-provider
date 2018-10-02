const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/DragScrollProvider.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [{ test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ }],
  },
}
