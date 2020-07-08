const webpack = require("webpack");
const merge = require("webpack-merge");
const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin");
const common = require("./webpack.common");
const CircularDependencyPlugin = require("circular-dependency-plugin");

const { entry, dist, root, env } = require("./paths");

const port = process.env.PORT || 4044;

module.exports = merge(common, {
  entry: {
    app: [
      `webpack-dev-server/client?http://localhost:${port}`,
      // bundle the client for webpack-dev-server
      // and connect to the provided endpoint
      "webpack/hot/only-dev-server",
      // bundle the client for hot reloading
      // only- means to only hot reload for successful updates
      entry,
    ],
  },
  output: {
    publicPath: "/",
  },
  devtool: "eval-source-map",
  plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: false,
      // allow import cycles that include an asynchronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new UnusedFilesWebpackPlugin({
      patterns: ["src/**/*.*"],
      globOptions: {
        ignore: [""],
      },
    }),
  ],
  devServer: {
    contentBase: [dist, root],
    historyApiFallback: true,
    disableHostCheck: true,
    overlay: true,
    hot: true,
    port,
  },
});
