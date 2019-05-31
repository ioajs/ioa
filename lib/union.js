'use strict';

const ioa = require('..');
const path = require('path');
const config = require('./config.js');
const common = require('./common.js');

const { cwd, components: ioaComponents } = ioa;
const { componentList } = common;

/**
 * 
 * @param {Object} app 父组件容器
 * @param {Object} components 子组件配置项
 */
function union(app, components) {

   if (components) {

      for (const name in components) {

         const options = components[name];

         const { enable } = options;

         if (enable !== true) continue;

         let component = ioaComponents[name];

         if (component === undefined) {

            component = {
               $name: name,
               $parent: {},
               $children: {},
               levels: { config },
               shared(key, value) {

                  const { $parent } = this;

                  for (const name in $parent) {

                     const app = $parent[name];

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

         // 建立双向关联
         component.$parent[app.$name] = app;

         app.$children[name] = component;

         // 递归关联子集
         union(component, options.components);

      }

   }

}

module.exports = union;