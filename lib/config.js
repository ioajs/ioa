'use strict';

const T = require('ttools');
const ioa = require('..');

const { NODE_ENV, components } = ioa;

// config加载配置项
module.exports = {
   "level": 10,
   /**
    * 环境配置合并
    * @param {*} container 
    */
   directory(container) {

      const config = { ...container.default };

      const envConfig = container[NODE_ENV];

      // 与环境变量配置合并
      if (envConfig) {
         T(config).object({ mixin: envConfig })
      }

      return config;

   },
   /**
    * 将main.config.components中的配置项混入到对应的app中
    */
   after(container) {

      if (container !== ioa.main) return;

      const { config } = container;

      if (config === undefined) return;

      const componentsConfig = config.components;

      if (componentsConfig === undefined) return;

      for (const name in componentsConfig) {

         const component = components[name];

         if (component) {

            const mixinConfig = componentsConfig[name];

            if (component.config) {
               T(component.config).object({ mixin: mixinConfig });
            } else {
               component.config = mixinConfig;
            }

         }

      }

   }
}