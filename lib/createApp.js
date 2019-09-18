'use strict';

const ioa = require('..');
const path = require('path');
const consoln = require('consoln');
const config = require('./config.js');
const generate = require('./generate.js');
const mixin = require('./mixin.js');
const { cwd, components: allComponents } = ioa;

/**
 * 创建app
 * @param {string} pathName app路径
 * @param {object} parent 父级
 */
function createApp(pathName, parent) {

   let appPath, appName;

   const relativePath = pathName.match(/^\./);

   // 相对路径
   if (relativePath) {
      appPath = path.join(cwd, pathName);
      const [name] = pathName.match(/\w+$/);
      appName = name;
   }

   // 绝对路径
   else if (path.isAbsolute(pathName)) {
      appPath = path.join(pathName);
      const [name] = pathName.match(/\w+$/);
      appName = name;
   }

   // 模块路径
   else {
      appPath = path.join(cwd, 'node_modules', pathName, 'lib');
      appName = pathName;
   }

   let app = allComponents[appName];

   if (app === undefined) {

      app = {
         $name: appName,
         $path: appPath,
         $parent: {}, // 父级关联
         $children: {}, // 子级关联
         $emitData: {}, // 共享数据
         loads: { config },
         /**
          * 订阅依赖
          */
         on(name) {

            if (!name) return;

            const app = createApp(name, this);

            const { $emitData } = app;

            const error = mixin(this, $emitData);

            if (error) {
               const newError = new Error(`${this.$name}组件与${app.$name}子组件之间存在属性合并冲突，app${error}`);
               throw consoln.error(newError);
            }

         },
         /**
          * 发送依赖
          * @param {string} key 
          * @param {*} value 
          */
         emit(key, value) {

            const { $parent } = this;
            const data = { [key]: value };

            for (const name in $parent) {

               const app = $parent[name];
               const error = mixin(app, data);

               if (error) {
                  const newError = new Error(`${name}组件与${this.$name}子组件之间存在属性合并冲突，$${error}`);
                  throw consoln.error(newError);
               }

            }

            this.$emitData[key] = value;

         },
      }

      allComponents[appName] = app;

      app.scopePath = path.join(app.$path, 'node_modules', '@app.js');

      generate(app);

   }

   // 建立父子级双向关联，根节点除外
   if (parent) {
      app.$parent[parent.$name] = parent;
      parent.$children[appName] = app;
   }

   return app;

}

module.exports = createApp;