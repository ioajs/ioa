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
const componentList = [], appList = [];

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
         throw new Error(`${pathName}路径无效`);
      }

      app.scopePath = path.join(app.path, 'node_modules', '@app');

      if (components) {

         app.components = {};

         for (const name in components) {

            const { enable } = components[name];

            if (enable === true) {

               if (rootComponents[name] === undefined) {
                  const component = {
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
                  app.components[name] = rootComponents[name];
               }

               rootComponents[name].dependApps.push(app);

               rootComponents[name].path = path.join(cwd, 'node_modules', name, 'app');
               rootComponents[name].scopePath = path.join(rootComponents[name].path, 'node_modules', '@app');

            }

         }

      }

   }

}

const [main] = Object.values(apps);

componentList.push(...appList);

root.$main = main;

for (const component of componentList) {
   component.$main = main;
}

module.exports = componentList;