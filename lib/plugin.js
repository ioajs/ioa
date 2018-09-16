'use strict';

const path = require('path')
const T = require('small-tools')
const batchImport = require('batch-import')
const { replaceMiddleware } = require('./helper')
const io = require('./io')
const app = require('..')

if (!app.pluginConfig) return

// 批量加载插件应用
T(app.pluginConfig).query({ '*.enable': true }, function (name) {

   const base = path.join('plugin', name)
   const plugin = app.plugin[name]

   batchImport({
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

   // 替换配置项middleware
   replaceMiddleware(plugin)

   // io配置项解析
   io(plugin.io, plugin, app)

   // 尝试加载插件的默认入口文件
   try {
      require(path.join(app.pluginPath, name))
   } catch (error) {

   }

})