'use strict';

/**
 * 导出供.loader.js加载文件引用的配置项
 */

const T = require('ttools');
const { NODE_ENV } = require('.');

module.exports = {
   "config": {
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
       * 将main.config['@apps']中的配置项混入到对应的app中
       * @param {*} app 
       */
      after(app) {

         if (app.name !== 'main') return;

         if (app.config === undefined) return;

         const appsConfig = app.config['@apps'];

         if (appsConfig === undefined) return;

         const { apps } = app;

         for (const name in appsConfig) {

            const expandApp = apps[name];

            if (expandApp) {

               const mixinConfig = appsConfig[name];
               if (expandApp.config) {
                  T(expandApp.config).object({ mixin: mixinConfig });
               } else {
                  expandApp.config = mixinConfig;
               }

            }

         }

      }
   },
}