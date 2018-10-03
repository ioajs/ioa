'use strict';

const path = require('path')
const T = require('small-tools')
const lloader = require('lloader')
const base = require('./base')
const io = require('./io')
const helper = require('./helper')
const { mixinConfig, replaceMiddleware } = helper
const { apps, cwd } = base

// 加载组件配置文件
let appsConfig
const appsPath = path.join(cwd, 'apps')

try {
   appsConfig = require(path.join(appsPath, 'config.js'))
} catch (error) {
   throw new Error(`缺少apps/config.js配置文件`)
}

// 提前创建app容器
T(appsConfig).query({ '*.enable': true }, name => {

   apps[name] = { name, ...base }

})

for (const name in apps) {

   const app = apps[name]

   // 供私有ioa模块读取
   base.component = app

   // 加载组件内私有ioa模块，缓存每个app对应的实例
   try {
      require(path.join(appsPath, name, 'node_modules', 'ioa'))
   } catch (error) {
      throw new Error(`${name}应用缺少ioa模块依赖`)
   }

   const appPath = path.join('apps', name)

   lloader(appPath, app).set({
      "io.js": {
         "level": 0,
         import(options) {

            for (const key in options) {

               if (apps[key]) {
                  io(options[key], apps[key], app)
               } else {
                  throw new Error(`${name}应用缺少外部${key}应用${error}依赖`)
               }

            }
            
         }
      },
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
            replaceMiddleware(app, data)
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

}


lloader.load()