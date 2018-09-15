'use strict';

const T = require('small-tools')

/**
 * 配置合并、替换
 * @param {*} app 
 */
module.exports = {
   mixinConfig(app) {

      // 内置基础配置项
      const config = {
         middlewares: [],
         port: 8800
      }

      // 与默认配置合并
      T(config).object({ mixin: app.config.default })

      let envConfig = app.config[app.NODE_ENV]

      // 与环境变量配置合并
      if (envConfig) {
         T(config).object({ mixin: envConfig })
      }

      return config

   },
   /**
    * 配置项middleware替换
    * @param {*} app 
    */
   replaceMiddleware(app) {

      // 全局中间件配置替换
      let middlewares = app.config.middlewares

      if (middlewares) {

         for (let key in middlewares) {
            let name = middlewares[key]
            let middleware = app.middleware[name]
            if (middleware) {
               middlewares[key] = middleware
            } else {
               throw new Error(`没有找到${name}全局中间件`)
            }
         }

      }

   }
}