const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: [
    'path-browserify',
    'crypto-browserify',
    'stream-browserify',
    'browserify-zlib',
    'querystring-es3',
    'stream-http'
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'https://dev-duel-alpha.vercel.app',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
});
