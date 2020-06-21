const isDev = process.env.NODE_ENV === "development";

const targets = isDev
  ? { chrome: 75 }
  : {
      ie: 11,
      edge: 14,
      firefox: 45,
      chrome: 49,
      safari: 10,
    };

const presets = [
  [
    "@babel/preset-env",
    {
      targets,
      corejs: "2",
      useBuiltIns: "usage",
      modules: false,
    },
  ],
  "@babel/preset-react",
];

const plugins = [
  ["babel-plugin-styled-components", { displayName: isDev }],
  "@babel/plugin-syntax-dynamic-import",
  ["@babel/plugin-proposal-class-properties", { loose: false }],
  "@babel/plugin-transform-runtime",
  "react-hot-loader/babel",
];

module.exports = {
  plugins,
  presets,
  ignore: ["./src/assets/products/"],
  env: {
    test: {
      plugins: ["@babel/plugin-transform-modules-commonjs"],
    },
    production: {
      plugins: ["transform-react-remove-prop-types"],
    },
  },
};
