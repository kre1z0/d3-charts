const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");

const babelOptions = require("../.babelrc");
const { dist, src, nodeModules, template, staticPath, ui } = require("./paths");

module.exports = {
  mode: process.env.NODE_ENV,

  output: {
    path: dist,
    filename: `${staticPath}/js/[name].[hash:7].js`,
  },

  resolve: {
    modules: [src, nodeModules],
    extensions: [".ts", ".tsx", ".js", "jsx", ".json"],
    alias: { "react-dom": "@hot-loader/react-dom", "~": src },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: babelOptions,
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
        include: [src],
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: babelOptions,
        include: [src],
      },
      {
        test: /\.css$/,
        use: [
          require.resolve("style-loader"),
          {
            loader: require.resolve("css-loader"),
            options: {
              modules: true,
              localIdentName: "[name]__[local]___[hash:base64:5]",
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              ident: "postcss", // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => [require("postcss-flexbugs-fixes"), autoprefixer()],
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "url-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: `${staticPath}/img/[name].[hash:7].[ext]`,
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: `${staticPath}/fonts/[name].[hash:7].[ext]`,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        STATIC_PATH: JSON.stringify(staticPath),
      },
    }),
    new HTMLPlugin({
      title: "d3 charts",
      config: "{{config|safe}}",
      template,
      minify: true,
    }),
  ],
};
