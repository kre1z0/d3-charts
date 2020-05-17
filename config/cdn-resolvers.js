const moduleToCdn = require(`module-to-cdn`);

/** https://github.com/mastilver/module-to-cdn/blob/master/modules.json **/

const { dependencies } = require("../package.json");

const resolve = (name, version, { env }) => {
  const list = {
    "react-dom": {
      name: `react-dom`,
      var: `ReactDOM`,
      url:
        env === "production"
          ? `https://unpkg.com/@hot-loader/react-dom@${dependencies["@hot-loader/react-dom"]}/umd/react-dom.production.min.js`
          : `https://unpkg.com/@hot-loader/react-dom@${dependencies["@hot-loader/react-dom"]}/umd/react-dom.development.js`,
      version: dependencies["@hot-loader/react-dom"],
    },
  };

  return list[name];
};

module.exports = (name, version, opts) =>
  moduleToCdn(name, version, opts) || resolve(name, version, opts);
