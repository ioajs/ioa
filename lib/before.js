'use strict';

const path = require('path')
const T = require('small-tools')
const batchImport = require('batch-import')
const { mixinConfig } = require('./helper')
const io = require('./io')
const app = require('..')
const baseApp = { ...app }


// 加载主应用
batchImport({
   "config": {
      "path": "config",
      complete() {
         return mixinConfig(app)
      }
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
   }
}, app)



// 尝试加载组件应用
app.componentPath = path.join(app.root, 'component')

try {
   app.componentConfig = require(path.join(app.componentPath, 'config.js'))
} catch (error) {
   return
}

T(app.componentConfig).query({ '*.enable': true }, function (name) {

   const base = path.join('component', name)

   const component = { parent: app, ...baseApp }

   app.componentApp = component
   app.component[name] = component

   // 加载组件内ioa模块，导出并缓存每个component对应的实例
   try {
      require(path.join(app.componentPath, name, 'node_modules', 'ioa'))
   } catch (error) {
      app.logger.warn(`${name}组件加载失败`, error)
      return
   }

   batchImport({
      "config": {
         "path": path.join(base, 'config'),
         complete() {
            return mixinConfig(component)
         }
      },
      "extend": {
         "path": path.join(base, 'app/extend'),
         complete(data) {
            for (let name in data) {
               this[name] = data[name]
            }
            return data
         }
      }
   }, component)

   // 尝试加载io配置文件
   try {
      component.io = require(path.join(app.componentPath, name, 'io'))
   } catch (error) {
      return
   }

   io(component.io, component, app)

})