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
            paths: [
              ...glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
              path.join(__dirname, 'node_modules/react-phone-input-2/lib/style.css'),
            ],
            
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
              
                // PhoneInput relevant
                /^react-phone-input-/,
                /^react-tel-input$/,
                /^flag$/,
                /^flag-dropdown$/,
                /^selected-flag$/,
                /^country-list$/,
                /^form-control$/,
                /^phone-input-container$/,
                /^custom-flag-button$/,
                /^custom-dropdown$/,
                /^country$/,
                /^highlight$/,
                /^search$/,
                /^search-box$/,
                /^arrow$/,
                /^dial-code$/,
              ],              
              deep: [
                /slick-active$/, 
                /is-active$/, 
                /show$/, 
                /active$/
              ],
              greedy: [
                /^slick/, 
                /^bs-/, 
                /^react-tel-input/
              ]
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