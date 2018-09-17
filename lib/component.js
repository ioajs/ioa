'use strict';

const path = require('path')
const T = require('small-tools')
const batchImport = require('batch-import')
const { replaceMiddleware } = require('./helper')
const io = require('./io')
const app = require('..')

if (!app.componentConfig) return

// 批量加载组件应用
T(app.componentConfig).query({ '*.enable': true }, function (name) {

   const base = path.join('component', name)
   const component = app.component[name]

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
   }, component)

   // 替换配置项middleware
   replaceMiddleware(component)

   // io配置项解析
   io(component.io, component, app)

   // 尝试加载组件的默认入口文件
   try {
      require(path.join(app.componentPath, name))
   } catch (error) {

   }

})