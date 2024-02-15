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
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
});
