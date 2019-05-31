'use strict';

const ioa = require('..');
const path = require('path');
const levels = require('./levels.js');

const { cwd, loadOptions } = ioa;

const appList = []; // 保存应用组件
const componentList = []; //保存扩展组件
const { apps, components: ioaComponents } = ioa;

for (const pathName in loadOptions) {

   const { enable, components } = loadOptions[pathName];

   if (enable === true) {

      const [name] = pathName.match(/\w+$/);

      const app = {
         $name: name,
         $childComponents: {},
         levels: { ...levels }
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

      if (components) {

         for (const name in components) {

            const { enable } = components[name];

            if (enable === true) {

               let component = ioaComponents[name];

               if (component === undefined) {
                  component = {
                     $name: name,
                     parentApps: {},
                     levels: { ...levels },
                     shared(key, value) {
                        const { parentApps } = this;
                        for (const name in parentApps) {
                           const app = parentApps[name];
                           if (app[key]) {
                              Object.assign(app[key], value);
                           } else {
                              app[key] = value;
                           }
                        }
                     },
                  };
                  ioaComponents[name] = component;
                  componentList.push(component);
               }

               // 建立双向关联
               component.parentApps[app.$name] = app;
               app.$childComponents[name] = component;

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