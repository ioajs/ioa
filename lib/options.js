'use strict';

const ioa = require('..');
const path = require('path');
const common = require('./common.js');
const union = require('./union.js');
const config = require('./config.js');

const { cwd, loadOptions } = ioa;
const { apps, components: ioaComponents } = ioa;
const { appList, componentList } = common;

for (const pathName in loadOptions) {

   const { enable, components } = loadOptions[pathName];

   if (enable === true) {

      const [name] = pathName.match(/\w+$/);

      const app = {
         $name: name,
         $children: {},
         levels: { config }
      };

      apps[name] = app;
      ioaComponents[name] = app;
      appList.push(app);

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

      app.scopePath = path.join(app.path, 'node_modules', '@app');

      union(app, components);

   }

}

// 选取第一个app作为主节点
const [main] = Object.values(apps);

ioa.main = main;

// 按扩展组件到应用组件的优先级排序
const allComponents = [
   ...componentList,
   ...appList
];

// 导出包含所有类型组件的同构队列
module.exports = allComponents;