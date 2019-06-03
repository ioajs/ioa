'use strict';

const path = require('path');
const fs = require('fs-extra');
const Lloader = require('lloader');
const ioa = require('..');

const { version } = ioa;
const loaderState = {};
const loaders = [];

/**
 * 生成组件作用域模块
 * @param {Array} queue 组件队列
 */
function generate(queue) {

   for (const componen of queue) {

      // 去重，防止重复加载
      if (loaderState[componen.$name]) {
         continue;
      } else {
         loaderState[componen.$name] = true;
      }

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

   return loaders;

}

module.exports = generate;