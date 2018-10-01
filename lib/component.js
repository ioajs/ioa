'use strict';

const path = require('path')
const T = require('small-tools')
const lloader = require('lloader')
const io = require('./io')
const app = require('./app')
const helper = require('./helper')
const { mixinConfig, replaceMiddleware } = helper
const { logger } = app
const baseApp = { ...app }

// 尝试加载组件配置文件
let componentsConfig
const componentsPath = path.join(app.root, 'components')

try {
   componentsConfig = require(path.join(componentsPath, 'config.js'))
} catch (error) {
   return
}

T(componentsConfig).query({ '*.enable': true }, function (name) {

   const component = { parent: app, ...baseApp }
   app.component = component
   app.components[name] = component

   // 加载组件内私有ioa模块，缓存每个component对应的实例
   try {
      require(path.join(componentsPath, name, 'node_modules', 'ioa'))
   } catch (error) {
      logger.warn(`${name}组件加载失败`, error)
      return
   }

   // 尝试加载io配置文件
   try {
      component.io = require(path.join(componentsPath, name, 'io'))
   } catch (error) {

   }

   const appPath = path.join('components', name, 'app')

   lloader(appPath, component).set({
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
         import(func, name) {
            if (func instanceof Function) {
               return func
            } else {
               throw new Error(`${name}模块导出必须为注入函数`)
            }
         },
         complete(data) {
            replaceMiddleware(component, data)
            return data
         }
      },
      "controller": {
         "level": 40,
         import(func, name) {
            if (func instanceof Function) {
               if (func.prototype) {
                  return new func()
               }
            } else {
               throw new Error(`${name}模块导出必须为注入函数`)
            }
         }
      },
      "router.js": false
   })

   // io配置项解析
   // io(component.io, component, app)

   // 尝试加载组件的默认入口文件
   // try {
   //    require(path.join(app.componentPath, name))
   // } catch (error) {

   // }

})


lloader.load()