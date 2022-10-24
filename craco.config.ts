import path from 'path'

module.exports = {
  // webpack 配置
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 代理接口
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9090', 
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:9090', 
        changeOrigin: true,
      }
    }
  }
}