const webpack = require('webpack');

module.exports = {
  style: {
    postcss: {
      loaderOptions: postcssLoaderOptions => {
        postcssLoaderOptions.postcssOptions = require('@sovryn/tailwindcss-config/postcss.config.js');
        return postcssLoaderOptions;
      },
    },
  },
  webpack: {
    configure: config => {
      // ts-loader is required to reference external typescript projects/files (non-transpiled)
      config.module.rules.push({
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          configFile: 'tsconfig.json',
        },
      });
      // config.ignoreWarnings = [
      //   /Failed to parse source map/,
      //   /Configure maximumFileSizeToCacheInBytes to change this limit/,
      // ];
      config.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        url: require.resolve('url'),
        zlib: false,
      };
      config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ]);
      return config;
    },
  },
  babel: {
    presets: ['@babel/preset-react'],
  },
};
