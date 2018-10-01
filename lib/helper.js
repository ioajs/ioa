'use strict';

const T = require('small-tools')
const { NODE_ENV } = require('./app')

/**
 * 配置合并、替换
 * @param {*} app 
 */
module.exports = {
   mixinConfig(data) {

      // 内置基础配置项
      const config = {
         middlewares: [],
         port: 8800
      }

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
   replaceMiddleware(app, middlewares) {

      app.commonMiddlewares = []

      // 全局中间件配置替换
      const configMiddlewares = app.config.middlewares

      if (configMiddlewares) {

         for (const key in configMiddlewares) {
            const name = configMiddlewares[key]
            const middleware = middlewares[name]
            if (middleware) {
               app.commonMiddlewares[key] = middleware
            } else {
               throw new Error(`没有找到${name}全局中间件`)
            }
         }

      }

   }
}