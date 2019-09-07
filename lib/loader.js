'use strict';

/**
 * 加载指定配置选项的应用
 * @param {Array} options 
 */
function loader(...options) {

   const Lloader = require('lloader');
   const createApp = require('./createApp.js');

   if (options.length === 0) {
      options.push("./main");
   }

   const { apps, loaders } = this;

   for (const pathName of options) {

      if (!pathName) continue;

      const app = createApp(pathName);

      apps[app.$name] = app;

   }

   // 选取第一个app作为主节点
   const [main] = Object.values(apps);

   this.main = main;

   Lloader.loadAll(loaders, function (loads) {

      console.log('\x1b[32m\n******************************** ioa loader *******************************\n');

      // 显示加载顺序
      for (const name in loads) {

         console.log(`${name} -----------------------------------------------------------------`);

         const list = loads[name];

         for (const item of list) {

            const { nodePath, } = item;

            console.log(`›  ${nodePath}`);

         }

      }

      console.log(`\n************************************************************************\n\x1b[30m`);

   });

}

module.exports = loader;