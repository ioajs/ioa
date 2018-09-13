'use strict';

const batchImport = require('batch-import')
const mixin = require('./config')
const app = require('..')

// 在载入主框架前先加载必要的依赖
app.Controller = require('./extends/controller')

// 在载入主框架前先加载必要的依赖
app.Model = require('./extends/model')

// 预加载主框架
batchImport({
   "config": {
      "path": "config/"
   },
   "extend": {
      "path": "app/extend",
      complete(data) {
         // 对extend进行扁平化处理，缩短访问路径
         for (let name in data) {
            this[name] = data[name]
         }
         return data
      }
   },
   "model": {
      "path": "app/model/"
   },
   "middleware": {
      "path": "app/middleware/",
      import(name, func) {
         if (func instanceof Function) {
            // middleware保持原样输出，不执行函数
            return func
         } else {
            throw new Error(`${name}模块导出必须为注入函数`)
         }
      }
   },
   "controller": {
      "path": "app/controller/",
      import(name, func) {
         if (func instanceof Function) {
            if (func.prototype) {
               // 普通函数，不管是不是构造函数都可以使用new
               return new func(app)
            }
         } else {
            throw new Error(`controller/${name}模块导出必须为函数类型`)
         }
      }
   }
}, app)

// 配置合并
mixin(app)