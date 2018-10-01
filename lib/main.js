'use strict';

const lloader = require('lloader')
const app = require('./app')
const helper = require('./helper')
const { mixinConfig, replaceMiddleware } = helper

// 在载入主框架前先加载必要的依赖
app.Model = require('./extends/model')
app.Controller = require('./extends/controller')

lloader("app", app).set({
   "config": {
      "level": 10,
      complete(data) {
         return mixinConfig(data)
      }
   },
   "model": {
      "level": 20,
   },
   "middleware": {
      "level": 30,
      import(func) {
         // middleware函数保持原样输出，不执行
         if (func instanceof Function) {
            return func
         }
      },
      complete(data) {
         replaceMiddleware(app, data)
         return data
      }
   },
   "controller": {
      "level": 40,
      import(func, name) {
         if (func instanceof Function) {
            // 普通函数，不管是不是构造函数都可以使用new
            if (func.prototype) {
               return new func(app)
            }
         } else {
            throw new Error(`controller/${name}模块导出必须为函数类型`)
         }
      }
   },
   "router.js": false
})