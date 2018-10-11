'use strict';

const T = require('small-tools')
const { NODE_ENV } = require('..')


module.exports = {
   /**
    * 配置合并、替换
    * @param {*} app 
    */
   mixinConfig(data) {

      // 内置基础配置项
      const config = { middleware: [] }

      // 与默认配置合并
      T(config).object({ mixin: data.default })

      const envConfig = data[NODE_ENV]

      // 与环境变量配置合并
      if (envConfig) {
         T(config).object({ mixin: envConfig })
      }

      return config

   },
   /**
    * 公共middleware配置项转换
    * @param {*} app 
    */
   replaceMiddleware(app) {

      const configMiddleware = app.config.middleware

      if (!configMiddleware) return

      const middleware = app.middleware

      for (const key in configMiddleware) {

         const name = configMiddleware[key]
         const item = middleware[name]

         if (item) {
            app.AppMiddleware[key] = item
         } else {
            throw new Error(`没有找到${name}全局中间件`)
         }

      }

   }
}