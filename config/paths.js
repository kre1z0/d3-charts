const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  entry: resolve("../src/client.js"),
  template: resolve("../src/index.html"),
  src: resolve("../src"),
  dist: resolve("../dist"),
  root: resolve("../"),
  nodeModules: resolve("../node_modules"),
  packageFile: resolve("../package.json"),
  packageLockFile: resolve("../package-lock.json"),
  staticPath: "static",
  ui: resolve("../node_modules/@evergis/ui/src"),
};
