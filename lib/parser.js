'use strict';

const ioa = require('..');
const path = require('path');
const union = require('./union.js');
const generate = require('./generate.js');
const config = require('./config.js');

const { cwd, apps, components: allComponents } = ioa;

/**
 * 解析加载配置项
 * @param {Object} options 加载选项
 */
function parser(options) {

   const queue = [];

   for (const pathName in options) {

      const { enable, components } = options[pathName];

      if (enable !== true) continue;

      const [name] = pathName.match(/\w+$/);

      const app = {
         $name: name,
         $children: {},
         loads: { config }
      };

      apps[name] = app;
      allComponents[name] = app;
      queue.unshift(app);

      const relativePath = pathName.match(/^\./);

      // 相对路径
      if (relativePath) {
         app.path = path.join(cwd, pathName);
      }

      // 绝对路径
      else if (path.isAbsolute(pathName)) {
         app.path = path.join(pathName);
      }

      else {
         throw new Error(`无效路径：“${pathName}”`);
      }

      app.scopePath = path.join(app.path, 'node_modules', '@app.js');

      if (components) {

         const childQueue = union(app, components);
         
         queue.unshift(...childQueue);

      }

   }

   // 选取第一个app作为主节点
   const [main] = Object.values(apps);

   ioa.main = main;

   const loaders = generate(queue);

   return loaders;

}

module.exports = parser;