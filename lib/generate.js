'use strict';

const path = require('path');
const fs = require('fs-extra');
const Lloader = require('lloader');
const ioa = require('..');

const loaderState = {};
const loaders = [];

/**
 * 生成组件作用域模块
 * @param {Array} queue 组件队列
 */
function generate(queue) {

   for (const app of queue) {

      const { $name, scopePath } = app;

      // 去重，防止重复加载
      if (loaderState[$name]) {
         continue;
      } else {
         loaderState[$name] = true;
      }

      // 临时读取模块作用域ioa容器
      ioa.scope = app;

      // 模块作用域ioa依赖注入、版本对比、版本同步
      try {

         require(scopePath); // 加载、固化组件作用域内的@app模块

      } catch (error) {

         fs.outputFileSync(scopePath,
            `'use strict';const path = require('path');const ioa = require(path.join(process.cwd(), 'node_modules', 'ioa'));module.exports = ioa.scope;`
         );

         require(scopePath);

      }

      const { loads } = app;

      const loadPath = path.join(app.path, '.loader.js');
      let resolvePath;

      try {
         resolvePath = require.resolve(loadPath);
      } catch (error) {

      }

      if (resolvePath) {
         const loaderFile = require(resolvePath);
         Object.assign(loads, loaderFile);
      }

      const loader = new Lloader(app.path, app, loads);

      loaders.push(loader);

   }

   return loaders;

}

module.exports = generate;