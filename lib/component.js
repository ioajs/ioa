'use strict';

const path = require('path');
const ioa = require('..');
const options = require('./options.js');
const setOption = require('./setOption.js');

const { cwd } = ioa;

try {
   var appConfig = require(path.join(cwd, 'app.config.js'));
} catch (error) {
   throw error;
}

const appList = []; // 保存应用组件
const componentList = []; //保存扩展组件
const { apps, components: ioaComponents } = ioa;

for (const pathName in appConfig) {

   const { enable, components } = appConfig[pathName];

   if (enable === true) {

      const [name] = pathName.match(/\w+$/);

      const app = {
         name,
         ioa,
         apps,
         modules: {}, // 模块容器
         components: ioaComponents,
         childComponents: {},
         options: { ...options },
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
         app.path = path.join(pathName, 'app');
      }

      else {
         throw new Error(`“${pathName}”路径无效`);
      }

      app.scopePath = path.join(app.path, 'node_modules', '@app');

      if (components) {

         for (const name in components) {

            const { enable } = components[name];

            if (enable === true) {

               let component = ioaComponents[name];
               if (component === undefined) {
                  component = {
                     name,
                     ioa,
                     apps,
                     modules: {},
                     parentApps: {},
                     components: ioaComponents,
                     options: { ...options },
                     setOption,
                  };
                  ioaComponents[name] = component;
                  componentList.push(component);
               }

               component.parentApps[app.name] = app;
               app.childComponents[name] = component;

               const relativePath = name.match(/^\./);

               // 相对路径
               if (relativePath) {
                  component.path = path.join(cwd, name);
               }

               // 绝对路径
               else if (path.isAbsolute(name)) {
                  component.path = path.join(name, 'app');
               }

               // 模块路径
               else {
                  component.path = path.join(cwd, 'node_modules', name, 'app');
               }

               component.scopePath = path.join(component.path, 'node_modules', '@app');

            }

         }

      }

   }

}

const [main] = Object.values(apps);

main.isMain = true;

ioa.$main = main;

// 按扩展组件到应用组件的优先级排序
const allComponents = [
   ...componentList,
   ...appList
];

// 为所有组件添加$main快速引用
for (const component of allComponents) {
   component.$main = main;
}

// 导出包含所有类型组件的同构队列
module.exports = allComponents;