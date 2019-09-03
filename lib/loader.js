'use strict';

/**
 * 加载指定配置选项的应用
 * @param {Object} options 
 */
function loader(options) {

   const Lloader = require('lloader');
   const parser = require('./parser.js');

   if (options === undefined) {
      options = {
         "./main": {
            "enable": true,
         },
      };
   }

   const loaders = parser(options);

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