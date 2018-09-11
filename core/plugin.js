'use strict';

const path = require('path')
const T = require('small-tools')
const batchImport = require('batch-import')
const app = require('..')

const pluginPath = path.join(app.root, 'plugin')

try {
   var config = require(path.join(pluginPath, 'config.js'))
} catch (error) {

}

// 批量预加载插件框架
app.plugin = T(config).query({ '*.enable': true },
   pluginName => {

      let base = path.join('plugin', pluginName)

      try {
         require(path.join(pluginPath, pluginName))
      } catch (error) {

      }

      batchImport({
         "config": {
            "path": path.join(base, 'config'),
            import(name, data) {
               if (this[name]) {
                  Object.assign(data, this[name])
               }
               return data
            },
         },
         "extend": {
            "path": path.join(base, 'app/extend'),
            import(name, data) {
               if (this[name]) {
                  Object.assign(data, this[name])
               }
               if (data instanceof Function) {
                  data = data(app)
               }
               return data
            },
            complete(data) {
               for (let name in data) {
                  this[name] = data[name]
               }
               return data
            }
         },
         "model": {
            "path": path.join(base, 'app/model'),
            import(name, func) {
               if (this[name]) {
                  throw new Error(`${pluginName}插件中model/${name}模块存在命名冲突`)
               }
               if (func instanceof Function) {
                  return func(app)
               } else {
                  throw new Error(`${name}模块导出必须为函数`)
               }
            }
         },
         "middleware": {
            "path": path.join(base, 'app/middleware'),
            import(name, func) {
               if (this[name]) {
                  throw new Error(`${pluginName}插件中middleware/${name}模块存在命名冲突`)
               }
               if (func instanceof Function) {
                  return func
               } else {
                  throw new Error(`${name}模块导出必须为注入函数`)
               }
            }
         },
         "controller": {
            "path": path.join(base, 'app/controller'),
            import(name, func) {
               if (this[name]) {
                  throw new Error(`${pluginName}插件中controller/${name}模块存在命名冲突`)
               }
               if (func instanceof Function) {
                  if (func.prototype) {
                     return new func(app)
                  } else {
                     return func(app)
                  }
               } else {
                  throw new Error(`${name}模块导出必须为注入函数`)
               }
            }
         }
      }, app)

   }
)