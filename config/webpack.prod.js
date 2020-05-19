const merge = require("webpack-merge");
const common = require("./webpack.common");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const { entry } = require("./paths");

module.exports = merge(common, {
  entry: [entry],
  output: {
    publicPath: "./",
  },
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      verbose: true,
      watch: false,
      exclude: [],
      allowExternal: false,
      beforeEmit: false,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "report.html",
      openAnalyzer: false,
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      /** https://webpack.js.org/plugins/terser-webpack-plugin/ **/
      new TerserPlugin({
        extractComments: true,
        cache: true,
        parallel: true,
        sourceMap: false,
        terserOptions: {
          output: {
            comments: false,
          },
          extractComments: "all",
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
});
