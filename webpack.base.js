/**
 * Created by wanghx on 5/3/16.
 *
 * webpack.base.js
 *
 */

const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/main'
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },

  plugins: [
    new CopyWebpackPlugin([
        { from: 'media',
          to: 'static' },
        { from: 'public' }
      ])
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src')
      },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=90000' } 
    ]
  },

  resolve: {
    extensions: ['', '.js']
  }
};