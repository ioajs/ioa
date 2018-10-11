'use strict';

const logger = require('loggercc')
const { version } = require('./package.json')

// 由于根模块内部存在相互引用，需要提前导出app依赖
module.exports = {
   version,
   logger,
   apps: {},
   AppsMiddleware: [],
   cwd: process.cwd(),
   NODE_ENV: process.env.NODE_ENV || 'production',
   /**
    * 设置主应用
    * @param {String} name 主应用名称
    */
   main(name) {

      const app = this.apps[name]
      
      if (app) {
         this.app = app
      }

      return this

   }
}

// 加载应用
require('./lib/loader')

// http服务
require('./lib/http')