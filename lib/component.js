'use strict';

const path = require('path');
const root = require('..');
const options = require('./options.js');
const setOption = require('./setOption.js');

const { cwd } = root;

try {
   var appConfig = require(path.join(cwd, 'app.config.js'));
} catch (error) {
   throw error;
}

const { apps, components } = root;

const rootComponents = components;
const componentList = [];
const appList = [];

for (const pathName in appConfig) {

   const { enable, components } = appConfig[pathName];

   if (enable === true) {

      const [name] = pathName.match(/\w+$/);

      const app = {
         name,
         pathName,
         options: { ...options },
         ...root
      };

      apps[name] = app;

      root.components[name] = app;

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

         app.components = {};

         for (const name in components) {

            const { enable } = components[name];

            if (enable === true) {

               let component = rootComponents[name];

               if (component === undefined) {
                  component = {
                     name,
                     setOption,
                     dependApps: [],
                     options: { ...options },
                     ...root
                  };
                  rootComponents[name] = component;
                  app.components[name] = component;
                  componentList.push(component);
               } else {
                  app.components[name] = component;
               }

               component.dependApps.push(app);

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

root.$main = main;

componentList.push(...appList);

for (const component of componentList) {
   component.$main = main;
}

// 导出包含应用组件和扩展组件的同构队列
module.exports = componentList;