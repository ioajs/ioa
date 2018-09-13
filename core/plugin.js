'use strict';

const path = require('path')
const T = require('small-tools')
const batchImport = require('batch-import')
const mixin = require('./config')
const app = require('..')

const pluginPath = path.join(app.root, 'plugin')

try {
   var config = require(path.join(pluginPath, 'config.js'))
} catch (error) {

}

// 批量预加载插件应用
T(config).query({ '*.enable': true }, function (name) {

   const base = path.join('plugin', name)

   const config = T(app.config).clone()
   const extend = T(app.extend).clone()
   const model = T(app.model).clone()
   const middleware = T(app.middleware).clone()
   const controller = T(app.controller).clone()

   const plugin = {
      ...app,
      config,
      extend,
      ...extend,
      model,
      middleware,
      controller
   }

   app.plugin[name] = plugin
   app.currentPlugin = plugin

   // 加载插件内ioa模块
   try {
      require(path.join(pluginPath, name, 'node_modules', 'ioa'))
   } catch (error) {
      app.logger.warn(`${name}插件加载失败`, error)
      return
   }

   // 尝试加载入口文件
   try {
      require(path.join(pluginPath, name))
   } catch (error) {

   }

   batchImport({
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
   }, plugin)

   // 插件配置合并
   mixin(plugin)
   
})