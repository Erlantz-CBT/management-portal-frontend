const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/src/sass/main.scss"`
      }
    }
  },
  devServer: {
		proxy: 'http://localhost:8080/'
	}
})
