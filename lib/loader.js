'use strict';

function loader(loadOptions) {

   const path = require('path');
   const fs = require('fs-extra');
   const Lloader = require('lloader');
   const ioa = require('..');

   if (loadOptions === undefined) {
      loadOptions = {
         "./main": {
            "enable": true,
         },
      };
   }

   ioa.loadOptions = loadOptions;

   const componentList = require('./options.js');

   const { version } = ioa;

   const loaders = [];

   for (const componen of componentList) {

      // 临时读取模块作用域ioa容器
      ioa.scope = componen;

      // 模块作用域ioa依赖注入、版本对比、版本同步
      try {
         const pack = require(path.join(componen.scopePath, 'package.json'))
         if (pack.version !== version) {
            throw null;
         }
      } catch (error) {
         fs.outputFileSync(path.join(componen.scopePath, 'package.json'),
            `{"version": "${version}","main": "index.js"}`
         );
         fs.outputFileSync(path.join(componen.scopePath, 'index.js'),
            `'use strict';const path = require('path');const ioa = require(path.join(process.cwd(), 'node_modules', 'ioa'));module.exports = ioa.scope;`
         );
      }

      // 加载、固化组件作用域内的@app模块
      require(componen.scopePath);

      const loader = new Lloader(componen.path, componen, componen.levels);

      delete componen.path;
      delete componen.scopePath;

      loaders.push(loader);

   }

   Lloader.loadAll(loaders, function (group) {

      console.log('');

      console.log('\x1b[32m******************************** level *******************************\x1b[30m');

      // 显示加载顺序
      for (const name in group) {

         console.log(`\x1b[32m${name} -----------------------------------------------------------------\x1b[30m`);
         const list = group[name];

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