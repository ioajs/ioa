'use strict';

const path = require('path');
const fs = require('fs-extra');
const Lloader = require('lloader');
const ioa = require('..');
const componentList = require('./component.js');

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

   const loader = new Lloader(componen.path, componen, componen.options);

   delete componen.path;
   delete componen.scopePath;

   loaders.push(loader);

}

Lloader.loadAll(loaders, function (group) {

   console.log('');

   // 显示加载顺序
   for (const name in group) {
      const list = group[name];
      console.log(`\x1b[32m------------------------------ loader \x1b[33m${name}\x1b[32m ------------------------------\x1b[30m`);
      for (const item of list) {
         const { container, name, path } = item;
         console.log(` \x1b[33mapps.${container.$name}.${name} \x1b[35m${path}\x1b[30m`);
      }
   }

   console.log('');

});