const Critters = require('critters-webpack-plugin');
const path = require('path');
const glob = require('glob');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
};

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.plugins.push(
          new PurgeCSSPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
            safelist: {
              standard: [
                /^col-/,
                /^row$/,
                /^container$/,
                /^container-fluid$/,
                /^g-/,
                /^offset-/,
                /^align-/,
                /^carousel/,
                /^modal/,
                /^btn/,
                /^slick/,
                /^fade/,
                /^show/,
                /^dropdown/,
                /^accordion/,
                /^toast/,
                /^spinner/,
                /^form/,
                /^weather/,
                /^alert/,
                /^badge/,
                /^collapse/,
                /^active/,
                /^skeleton/,
                /^transition/,
                /^table/,
                // dodaj sve koje neće raditi
              ],
              deep: [/slick-active$/, /is-active$/, /show$/, /active$/],
              greedy: [/^slick/, /^bs-/]
            },
          }),
          new Critters({
            preload: 'swap',
            pruneSource: true,
            compress: true,
            logLevel: 'info',
            inlineThreshold: 10000, // Inline all styles below 10kb (increase if needed)
            pruneSource: true,
            minimize: true,
          })
        );
      }

      return webpackConfig;
    },
  },
};