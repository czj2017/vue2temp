const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /* 打包后的基础路径 */
  publicPath: process.env.VUE_APP_BASE_URL ? '/' + process.env.VUE_APP_BASE_URL + '/' : '/',
  // 'dist', 生产环境构建文件的目录
  outputDir: process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : 'dist',
  // 相对于outputDir的静态资源(js、css、img、fonts)目录
  assetsDir: 'static',
  // 默认在生成的静态资源文件名中包含hash以控制缓存
  filenameHashing: true,
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463
   */
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
 
  configureWebpack: (config) => {
  },
  
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
  },
  
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
        },
        javascriptEnabled: true,
      }
    }
  },
  
  devServer: {
    port: 3000,
    proxy: {
      '/zsxc': {
        target: 'http://localhost:8080/bysj/', //请求本地 需要jeecg-boot后台项目
        ws: false,
        changeOrigin: true
      },
    }
  },
  lintOnSave: false
}