'use strict';

const ioa = require('..');
const path = require('path');
const consoln = require('consoln');
const config = require('./config.js');
const mixin = require('./mixin.js');
const generate = require('./generate.js');

const { cwd, components: allComponents } = ioa;

/**
 * 创建app
 * @param {object} parent 父级
 * @param {string} name app名称
 */
function createApp(parent, name) {

   let app = allComponents[name];

   if (app === undefined) {

      app = {
         $name: name,
         $parent: {}, // 父级关联
         $children: {}, // 子级关联
         $emitData: {}, // 共享数据
         loads: { config },
         /**
          * 导出依赖至父级
          * @param {string} key 
          * @param {*} value 
          */
         emit(key, value) {

            const { $parent } = this;
            const join = { [key]: value };

            for (const name in $parent) {

               const app = $parent[name];
               const error = mixin(app, join);

               if (error) {
                  const newError = new Error(`${name}组件与${this.$name}子组件之间存在属性合并冲突，$${error}`);
                  throw consoln.error(newError);
               }

            }

            this.$emitData[key] = value;

         },
         /**
          * 导入依赖
          */
         on(name, func) {

            const app = createApp(this, name);

            generate([app]);

            let { $emitData } = app;

            if (func) {
               $emitData = func($emitData);
            }

            const error = mixin(this, $emitData);

            if (error) {
               const newError = new Error(`${this.$name}组件与${app.$name}子组件之间存在属性合并冲突，app${error}`);
               throw consoln.error(newError);
            }

         }
      }

      allComponents[name] = app;

      const relativePath = name.match(/^\./);

      // 相对路径
      if (relativePath) {
         app.path = path.join(cwd, name);
      }

      // 绝对路径
      else if (path.isAbsolute(name)) {
         app.path = path.join(name);
      }

      // 模块路径
      else {
         app.path = path.join(cwd, 'node_modules', name, 'lib');
      }

      app.scopePath = path.join(app.path, 'node_modules', '@app.js');

   }

   // 建立双向关联
   app.$parent[parent.$name] = parent;

   parent.$children[name] = app;

   return app;

}

/**
 * 关联多个组件
 * @param {Object} parent 父组件
 * @param {Object} options 子组件配置项
 */
function union(parent, options) {

   const queue = [];

   for (const name in options) {

      const value = options[name];

      if (!value) continue;

      const app = createApp(parent, name);

      queue.unshift(app);

   }

   return queue;

}

module.exports = union;