const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    vueTs: {
      checkSyntax: false  // Disable TypeScript checking in development
    }
  },
  productionSourceMap: false,
  chainWebpack: config => {
    // Disable TypeScript type checking
    config.plugins.delete('fork-ts-checker')
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/src/sass/main.scss"`
      }
    }
  },
  devServer: {
		proxy: {
      '^/portal-backend': {
        target: 'http://localhost:8080/'
      },
      '^/notifications': {
        target: 'http://localhost:8082/',
        ws: true
      }
    }
	}
})
