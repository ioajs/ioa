'use strict';

const path = require('path')
const T = require('small-tools')
const batchImport = require('batch-import')
const app = require('..')

try {
   var config = require(path.join(app.root, 'plugin/config.js'))
} catch (error) {

}

// 批量预加载插件框架
T(config).query({ '*.enable': true }, name => {

   let bath = `plugin/${name}`

   batchImport({
      "config": {
         "path": `${bath}/config/`,
         import(name, data) {
            if (this[name]) {
               Object.assign(data, this[name])
            }
            return data
         },
      },
      "extend": {
         "path": `${bath}/app/extend`,
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
         "path": `${bath}/app/model/`,
         import(name, func) {
            if (this[name]) {
               throw new Error(`${iten}插件中model/${name}模块存在命名冲突`)
            }
            if (func instanceof Function) {
               return func(app)
            } else {
               throw new Error(`${name}模块导出必须为函数`)
            }
         }
      },
      "middleware": {
         "path": `${bath}/app/middleware/`,
         import(name, func) {
            if (this[name]) {
               throw new Error(`${iten}插件中middleware/${name}模块存在命名冲突`)
            }
            if (func instanceof Function) {
               return func
            } else {
               throw new Error(`${name}模块导出必须为注入函数`)
            }
         }
      },
      "controller": {
         "path": `${bath}/app/controller/`,
         import(name, func) {
            if (this[name]) {
               throw new Error(`${iten}插件中controller/${name}模块存在命名冲突`)
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

})