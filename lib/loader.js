'use strict';

const path = require('path')
const T = require('small-tools')
const lloader = require('lloader')
const fs = require('fs-extra')
const root = require('..')
const helper = require('./helper')
const Model = require('./extends/model')
const Controller = require('./extends/controller')
const io = require('./io')

const { apps, cwd } = root

let appsConfig

// 多应用模式
try {

   fs.accessSync(path.join(cwd, 'apps'))

   root.mode = 'apps'

   try {
      appsConfig = require(path.join(cwd, root.mode, 'config.js'))
   } catch (error) {
      throw new Error(`缺少apps/config.js配置文件`)
   }

}

// 单应用模式
catch (error) {

   root.mode = 'app'

   appsConfig = {
      "app": {
         "enable": true
      }
   }

}


// 预创建app容器
T(appsConfig).query({ '*.enable': true }, name => {

   const { config = {}, package: _package } = appsConfig[name]

   const app = {
      name,
      ...root,
      Model,
      Controller,
      config,
      model: {},
      middleware: {},
      service: {},
      controller: {},
      commonMiddleware: [],
   }

   apps[name] = app

   if (_package) {

      app.path = path.join('node_modules', _package, 'app')
      app.ioaPath = path.join(cwd, 'node_modules', _package, 'node_modules', 'ioa')

   } else {

      if (root.mode === 'apps') {
         app.path = path.join('apps', name)
      } else {
         app.path = name
      }

      app.ioaPath = path.join(cwd, app.path, 'node_modules', 'ioa')

   }

})

const { mixinConfig, replaceMiddleware } = helper

for (const name in apps) {

   const app = apps[name]

   // 供私有ioa模块临时读取的动态容器
   root.component = app

   // 加载组件内私有ioa模块，缓存每个app对应的实例
   try {
      require(app.ioaPath)
   } catch (error) {
      fs.copySync(path.join(cwd, 'node_modules', 'ioa', '.component'), app.ioaPath)
      require(app.ioaPath)
   }

   lloader(app.path, app).set({
      "io.js": {
         "level": 0,
         module(options) {
            for (const key in options) {
               if (apps[key]) {
                  io(options[key], apps[key], app)
               } else {
                  throw new Error(`${name}应用缺少${key}应用依赖`)
               }
            }
         }
      },
      "config": {
         "level": 10,
         directory(config) {
            return mixinConfig(config)
         }
      },
      "model": {
         "level": 20,
      },
      "middleware": {
         "level": 30,
         module(func, name) {
            if (func instanceof Function) {
               return func
            } else {
               throw new Error(`${name}模块导出必须为注入函数`)
            }
         },
         after() {
            replaceMiddleware(app)
         }
      },
      "service": {
         "level": 40,
      },
      "controller": {
         "level": 50,
         module(func, name) {
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