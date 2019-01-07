const webpack = require('webpack');
const path = require('path');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// paths
const SOURCE = path.resolve(__dirname, 'src');
const SINK = path.resolve(__dirname, 'lib');
const PUBLIC = path.resolve(__dirname, 'public');

// variables
const analyzeBundle = process.argv.indexOf('-a') >= 0;
const isProd = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';

const HTML_OPTIONS = {
  template: path.resolve(__dirname, './public/index.html'),
  minify: {
    collapseWhitespace: false,
    removeAttributeQuotes: false,
  },
};

module.exports = {
  context: SOURCE,
  entry: {
    app: ['./index.tsx'],
    vendor: ['react', 'react-dom', '@babel/polyfill'],
  },
  output: {
    pathinfo: !isProd,
    filename: 'static/js/[name].[hash:8].bundle.js',
    chunkFilename: 'static/js/[name].[hash:8].bundle.js',
    path: SINK,
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  target: 'web',
  devtool: 'inline-source-map"',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new ForkTsCheckerWebpackPlugin({ tsconfig: path.resolve(__dirname, './tsconfig.build.json') }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin(HTML_OPTIONS),
    new CopyWebpackPlugin([
      {
        from: PUBLIC,
        to: SINK,
        ignore: ['*.html'],
      },
    ]),
    new WorkboxPlugin.InjectManifest({
      swSrc: path.resolve(SOURCE, 'service-worker.js'),
    }),
    analyzeBundle && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
  devServer: {
    contentBase: SOURCE,
    publicPath: '/',
    historyApiFallback: true,
    hot: true,
  },
};
