'use strict';

const path = require('path')
const T = require('small-tools')
const lloader = require('lloader')
const app = require('./app')
const helper = require('./helper')
const { mixinConfig, replaceMiddleware } = helper
const { logger } = app
const baseApp = { ...app }

// 加载组件配置文件
let componentsConfig
const componentsPath = path.join(app.root, 'apps')

try {
   componentsConfig = require(path.join(componentsPath, 'config.js'))
} catch (error) {
   return
}

T(componentsConfig).query({ '*.enable': true }, function (name) {

   const component = { ...baseApp }
   app.component = component
   app.components[name] = component

   // 加载组件内私有ioa模块，缓存每个component对应的实例
   try {
      require(path.join(componentsPath, name, 'node_modules', 'ioa'))
   } catch (error) {
      logger.warn(`${name}组件缺少ioa模块依赖`)
      return
   }

   // 尝试加载package.json配置文件进行依赖检测
   let ioCongig

   try {
      const packageJson = require(path.join(componentsPath, name, 'package.json'))
      ioCongig = packageJson.ioDependencies
   } catch (error) {

   }

   T(ioCongig).object({
      forEach(name) {
         if (!componentsConfig[name]) {
            throw new Error(`缺少${name}组件依赖`)
         }
      }
   })

   const appPath = path.join('apps', name)

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

})


lloader.load()