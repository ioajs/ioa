'use strict';

const T = require('small-tools')
const logger = require('loggercc')
const { version } = require('./package.json')

// 由于根模块内部存在相互引用，需要提前导出app依赖
module.exports = {
   version,
   port: 8800,
   cwd: process.cwd(),
   NODE_ENV: process.env.NODE_ENV || 'production',
   logger,
   apps: {},
   /**
    * 设置默认app
    * @param {String} name 
    */
   default(name) {

      const port = T(this.apps[name]).get('config.port')
      
      if (port) {
         this.port = port
      }

   }
}

// 加载应用
require('./lib/loader')

// http服务
require('./lib/http')