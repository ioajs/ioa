'use strict';

const ioa = require('..');
const path = require('path');
const fs = require('fs-extra');
const consoln = require('consoln');
const Lloader = require('lloader');
const mixin = require('./mixin.js');

const { cwd, loaders, components: allComponents } = ioa;

/**
 * 创建app
 * @param {string} pathName app路径
 * @param {object} parent 父级
 */
function createApp(pathName, parent) {

   let $path, $name;

   const relativePath = pathName.match(/^\./);

   // 相对路径
   if (relativePath) {
      $path = path.join(cwd, pathName);
      const [name] = pathName.match(/\w+$/);
      $name = name;
   }

   // 绝对路径
   else if (path.isAbsolute(pathName)) {
      $path = path.join(pathName);
      const [name] = pathName.match(/\w+$/);
      $name = name;
   }

   // 模块路径
   else {
      $path = path.join(pathName, 'lib');
      $name = pathName;
   }

   let app = allComponents[$name];

   if (app === undefined) {

      // 检查组件是否存在
      try {
         $path = path.dirname(require.resolve($path));
      } catch (error) {
         throw consoln.error(`未找到“${pathName}”组件, 请检查“${$path}”路径下是否存在入口文件`);
      }

      const scopePath = path.join($path, 'node_modules', '@app.js');

      // 模块作用域ioa依赖注入
      try {

         // 在动态加载未知模块前，先使用fs模块探测文件是否存在
         // 如果直接使用require会产生模块缓存bug，首次require找不到模块后，不管之后模块是否存在，重复调用时还是找不到该模块
         fs.accessSync(scopePath);

      } catch (error) {

         fs.outputFileSync(scopePath, `module.exports = {};`);

      }

      app = require(scopePath); // 加载组件作用域内的@app模块

      Object.assign(app, {
         $name,
         $path,
         $parent: {}, // 父级关联
         $children: {}, // 子级关联
         $emitData: {}, // 共享数据
         loads: {}, // 加载器配置项
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
         /**
          * 设置加载项
          * @param {Object} options 
          */
         loader(options){
            Object.assign(this.loads, options);
         }
      })

      const { loads } = app;

      const loadPath = path.join($path, 'index.js');

      const options = require(loadPath); // 加载组件入口文件

      if (options) {
         Object.assign(loads, options);
      }

      const loader = new Lloader($path, app, loads);

      loaders.push(loader);

      allComponents[$name] = app;

   }

   // 建立父子级双向关联，根节点除外
   if (parent) {
      app.$parent[parent.$name] = parent;
      parent.$children[$name] = app;
   }

   return app;

}

module.exports = createApp;