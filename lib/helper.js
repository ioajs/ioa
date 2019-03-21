'use strict';

const T = require('ttools');
const { NODE_ENV } = require('..');

module.exports = {
   /**
    * 配置合并、替换
    * @param {*} app 
    */
   mixinConfig(data = {}) {

      // 内置基础配置项
      const config = {
         middleware: [],
         ...data.default
      }

      const envConfig = data[NODE_ENV]

      // 与环境变量配置合并
      if (envConfig) {
         T(config).object({ mixin: envConfig })
      }

      return config

   }
}