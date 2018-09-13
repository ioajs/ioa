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
T(config).query({ '*.enable': true }, function (pluginName) {

   const base = path.join('plugin', pluginName)

   try {
      // 加载插件内ioa混合app
      var pluginApp = require(path.join(pluginPath, pluginName, 'node_modules', 'ioa'))
      // 加载入口文件
      require(path.join(pluginPath, pluginName))
   } catch (error) {
      app.logger.warn(error)
   }

   app.plugin[pluginName] = batchImport({
      "config": {
         "path": path.join(base, 'config')
      },
      "extend": {
         "path": path.join(base, 'app/extend'),
         complete(data) {
            for (let name in data) {
               this[name] = data[name]
            }
            return data
         }
      },
      "model": {
         "path": path.join(base, 'app/model')
      },
      "middleware": {
         "path": path.join(base, 'app/middleware'),
         import(name, func) {
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
            if (func instanceof Function) {
               if (func.prototype) {
                  return new func()
               }
            } else {
               throw new Error(`${name}模块导出必须为注入函数`)
            }
         }
      }
   }, pluginApp)

})