var webpack = require('webpack');

module.exports = {
  entry: [
    //'babel-polyfill',
    './index.js',
  ],
  output: {
      filename: 'bundle.js'
  },
  module: {
    loaders: [
      { 
        test: /\.(jsx?|es6)$/,
        loader: 'babel',
        exclude: /(node_modules)/,
        query: {
          presets: ['es2015','react', 'stage-0'],
          plugins: [
            ["babel-plugin-transform-builtin-extend", {
              globals: ["Array"],
            }]
          ]
        }
      },
    ]
  },
};
