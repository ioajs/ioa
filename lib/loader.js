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

   const { apps } = this;

   for (const pathName of options) {

      if (!pathName) continue;

      const app = createApp(pathName);

      apps[app.$name] = app;

   }

   // 选取第一个app作为主节点
   const [main] = Object.values(apps);

   this.main = main;

   Lloader.loadAll(this.loaders, function (group) {

      console.log('\n\x1b[32m******************************** ioa loader **********************\n');

      // 显示加载顺序
      for (const level in group) {

         console.log(`\x1b[32m${level} -------------------------------------------------------------`);

         const filter = [];
         const list = group[level];

         for (const item of list) {

            const { error, nodePath } = item;

            if (error === undefined) {
               console.log(`\x1b[32m›  ${nodePath}`);
               filter.push(item);
            } else {
               console.log(`\x1b[33m×  ${nodePath}`);
            }

         }

         group[level] = filter;

      }

      console.log(`\n\x1b[32m*******************************************************************\x1b[30m\n`);

   });

}

module.exports = loader;