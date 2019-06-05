'use strict';

const ioa = require('..');
const path = require('path');
const logger = require('loggercc');
const config = require('./config.js');
const mixin = require('./mixin.js');
const generate = require('./generate.js');

const { cwd, components: allComponents } = ioa;

/**
 * 绑定组件依赖项
 * @param {Object} parent 父组件
 * @param {Object} options 子组件配置项
 */
function union(parent, options) {

   const queue = [];

   for (const name in options) {

      const option = options[name];

      const { enable } = option;

      if (enable !== true) continue;

      let component = allComponents[name];

      if (component === undefined) {

         component = {
            $name: name,
            $parent: {}, // 父级关联
            $children: {}, // 子级关联
            $sharedData: {}, // 共享数据
            levels: { config },
            /**
             * 导出依赖至父级
             * @param {*} key 
             * @param {*} value 
             */
            shared(key, value) {

               const { $parent } = this;
               const join = { [key]: value };

               for (const name in $parent) {

                  const component = $parent[name];
                  const error = mixin(component, join);

                  if (error) {
                     const newError = new Error(`${name}组件与${this.$name}子组件之间存在属性合并冲突，$${error}`);
                     throw logger.error(newError);
                  }

               }

               this.$sharedData[key] = value;

            },
            /**
             * 导入依赖，与ioa.loader(options)参数相同
             */
            loader(options) {

               const queue = union(this, options);

               generate(queue);

               for (const component of queue) {

                  const { $sharedData } = component;

                  const error = mixin(this, $sharedData);

                  if (error) {
                     const newError = new Error(`${this.$name}组件与${component.$name}子组件之间存在属性合并冲突，app${error}`);
                     throw logger.error(newError);
                  }

               }

            }
         };

         allComponents[name] = component;

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

      queue.unshift(component);

      // 建立双向关联
      component.$parent[parent.$name] = parent;

      parent.$children[name] = component;

   }

   return queue;

}

module.exports = union;