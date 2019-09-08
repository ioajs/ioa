'use strict';

const ioa = require('..');
const mixin = require('./mixin.js');

const { NODE_ENV, components } = ioa;

const contain = ['default.js', `${NODE_ENV}.js`];

// config加载配置项
module.exports = {
   "level": 10,
   before(options) {
      const filter = [];
      const { dirList } = options;
      for (const item of contain) {
         if (dirList.includes(item)) {
            filter.push(item);
         }
      }
      options.dirList = filter;
   },
   /**
    * 环境配置合并
    * @param {object} data 
    */
   directory(data) {

      const config = { ...data.default };

      const envConfig = data[NODE_ENV];

      // 与环境变量配置合并
      if (envConfig) {
         mixin(config, envConfig)
      }

      return config;

   },
   /**
    * 将main.config中的组件配置项混入到对应的app中
    */
   after({ root }) {

      if (root !== ioa.main) return;

      const { config } = root;

      if (config === undefined) return;

      for (const name in components) {

         const appConfig = config[name];

         if (appConfig) {

            const component = components[name];

            if (component.config) {
               mixin(component.config, appConfig);
            } else {
               component.config = appConfig;
            }

         }

      }

   }
}