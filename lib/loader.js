'use strict';

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

   Lloader.loadAll(loaders, function (levels) {

      console.log('');

      console.log('\x1b[32m******************************** level *******************************\x1b[30m');

      // 显示加载顺序
      for (const name in levels) {

         console.log(`\x1b[32m${name} -----------------------------------------------------------------\x1b[30m`);

         const list = levels[name];

         for (const item of list) {

            const { nodePath, } = item;

            console.log(`\x1b[32m›  \x1b[35m${nodePath}\x1b[30m`);

         }

      }

      console.log(`\x1b[32m************************************************************************\x1b[30m`);

      console.log('');

   });

}

module.exports = loader;