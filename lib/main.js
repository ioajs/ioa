'use strict';

const batchImport = require('batch-import')
const { replaceMiddleware } = require('./helper')
const app = require('..')

// 在载入主框架前先加载必要的依赖
app.Controller = require('./extends/controller')

// 在载入主框架前先加载必要的依赖
app.Model = require('./extends/model')

// 加载主应用
batchImport({
   "model": {
      "path": "app/model/"
   },
   "middleware": {
      "path": "app/middleware/",
      import(name, func) {
         // middleware函数保持原样输出，不执行
         if (func instanceof Function) {
            return func
         }
      }
   },
   "controller": {
      "path": "app/controller/",
      import(name, func) {
         if (func instanceof Function) {
            // 普通函数，不管是不是构造函数都可以使用new
            if (func.prototype) {
               return new func(app)
            }
         } else {
            throw new Error(`controller/${name}模块导出必须为函数类型`)
         }
      }
   }
}, app)


replaceMiddleware(app)