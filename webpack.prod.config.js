var config = require('./config-prod');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './client'
  ],
  resolve: {
    root: [ __dirname ],
    extensions:         ['', '.js', '.jsx']
  },
  output: {
    path:       path.join(__dirname, 'dist'),
    filename:   'bundle.js',
    publicPath: config.webContext + 'bundle/'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?localIdentName=[path][name]---[local]---[hash:base64:5]",
        include: __dirname
      },
      {
        test:    /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: __dirname,
        loaders: ['babel']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
