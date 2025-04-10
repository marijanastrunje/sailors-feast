const Critters = require('critters-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new Critters({
          preload: 'swap',
          pruneSource: true,
          compress: true,
          logLevel: 'info'
        })
      );
      return webpackConfig;
    }
  }
};
