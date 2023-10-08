const webpack = require("webpack");
//const dotEnvConfig = require('dotenv').config();
const withSourceMaps = require("@zeit/next-source-maps");
const withImages = require("next-images");
const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");

// if (dotEnvConfig.error) {
//   throw dotEnvConfig.error
// }

const plugins = [
  withSourceMaps,
  withImages,
  [
    withBundleAnalyzer,
    {
      analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
      analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
      bundleAnalyzerConfig: {
        server: {
          analyzerMode: "static",
          reportFilename: "../server-analyze.html"
        },
        browser: {
          analyzerMode: "static",
          reportFilename: "client-analyze.html"
        }
      }
    }
  ]
];

module.exports = withPlugins([...plugins], {
  webpack: (config, { dev, isServer }) => {
    const conf = config;
    conf.experimental = {
      appDir: true,
    };
    // Fixes npm packages that depend on `fs` module
    conf.node = {
      fs: "empty"
    };

    conf.plugins.push(new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: true
    }));

    return conf;
  }
});
