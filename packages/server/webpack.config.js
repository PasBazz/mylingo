const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // entry is where, say, your app starts - it can be called main.ts, index.ts, app.ts, whatever
  entry: ['webpack/hot/poll?100', './src/index.ts'],
  // This forces webpack not to compile TypeScript for one time, but to stay running, watch for file changes in project directory and re-compile if needed
  watch: true,
  // Is needed to have in compiled output imports Node.JS can understand. Quick search gives you more info
  target: 'node',
  // Prevents warnings from TypeScript compiler
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100'],
    }),
  ],
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    path: path.join(__dirname, 'lib'),
    filename: '[name].bundle.js',
  },
};
