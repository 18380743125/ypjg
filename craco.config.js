const path = require('path')
const CracoLessPlugin = require('craco-less')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#f7d30d' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    // 配置别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 代理接口
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
      },
      '/resourse': {
        target: 'http://localhost:9090',
        changeOrigin: true,
      },
    },
  },

  style: {
    postcss: {
      mode: 'extends',
      loaderOptions: {
        postcssOptions: {
          ident: 'postcss',
          plugins: [
            [
              'postcss-px-to-viewport-8-plugin',
              {
                viewportWidth: 750,
                exclude: [/node_modules/],
              },
            ],
          ],
        },
      },
    },
  },
}
