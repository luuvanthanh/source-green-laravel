// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './config.route';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[next] = env[next];
  return prev;
}, {});
const { REACT_APP_ENV } = process.env;
export default {
  hash: true,
  antd: {},
  define: envKeys,
  dva: {
    hmr: true,
  },
  sass: {
    implementation: require('node-sass'),
  },
  locale: {
    default: 'en-US',
    antd: true,
    baseNavigator: false,
    title: false,
  },
  dynamicImport: {
    loading: '@/components/LayoutComponents/Loader',
  },
  targets: {
    ie: 11,
  },
  routes,
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  publicPath: '/',
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  chunks: ['vendors', 'umi'],
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
          },
        },
      },
    });
  },
  fastRefresh: {},
};
