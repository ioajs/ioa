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

      const { $name, scopePath } = componen;

      // 去重，防止重复加载
      if (loaderState[$name]) {
         continue;
      } else {
         loaderState[$name] = true;
      }

      // 临时读取模块作用域ioa容器
      ioa.scope = componen;

      // 模块作用域ioa依赖注入、版本对比、版本同步
      try {

         const pack = require(path.join(scopePath, 'package.json'))
         if (pack.version !== version) {
            throw null;
         }

      } catch (error) {

         fs.outputFileSync(path.join(scopePath, 'package.json'),
            `{"version": "${version}","main": "index.js"}`
         );

         fs.outputFileSync(path.join(scopePath, 'index.js'),
            `'use strict';const path = require('path');const ioa = require(path.join(process.cwd(), 'node_modules', 'ioa'));module.exports = ioa.scope;`
         );

      }

      // 加载、固化组件作用域内的@app模块
      require(scopePath);

      const { levels } = componen;

      const loadPath = path.join(componen.path, '.loader.js');
      let resolvePath;

      try {
         resolvePath = require.resolve(loadPath);
      } catch (error) {

      }

      if (resolvePath) {
         const levelsFile = require(resolvePath);
         Object.assign(levels, levelsFile);
      }

      const loader = new Lloader(componen.path, componen, levels);

      loaders.push(loader);

   }

   return loaders;

}

module.exports = generate;