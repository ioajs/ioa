'use strict';

const path = require('path')
const T = require('ttools')
const lloader = require('lloader')
const fs = require('fs-extra')
const root = require('..')
const helper = require('./helper')
const Model = require('./extends/model')
const Controller = require('./extends/controller')
const io = require('./io')

const { apps, cwd } = root

try {
   var PackageIo = require(path.join(cwd, 'package-app.json'))
} catch (error) {
   throw new Error(`缺少package-app.json配置文件`)
}

// 多应用模式
try {

   fs.accessSync(path.join(cwd, 'apps'))

   root.mode = 'apps'

   PackageIo.main = {
      "enable": true
   }

}

// 单应用模式
catch (error) {

   root.mode = 'app'

   PackageIo.app = {
      "enable": true
   }

}


// 预构建app容器
T(PackageIo).query({ '*.enable': true }, name => {

   const { config: _config = {}, path: _path, package: _package } = PackageIo[name]

   const app = {
      name,
      ...root,
      apps,
      Model,
      Controller,
      _config,
      config: {},
      model: {},
      middleware: {},
      service: {},
      controller: {},
      AppMiddleware: [],
   }

   apps[name] = app

   // 自定义path模块（相对路径）
   if (_path) {

      app.path = _path
      app.ioaPath = path.join(cwd, _path, 'node_modules', 'ioa')

   }

   // npm模块组件
   else if (_package) {

      app.path = path.join('node_modules', _package, 'app')
      app.ioaPath = path.join(cwd, 'node_modules', _package, 'node_modules', 'ioa')

   }

   else {

      if (root.mode === 'apps') {
         app.path = path.join('apps', name)
         if (name === 'main') {
            root.app = app
         }
      } else {
         app.path = name
         root.app = app
      }

      app.ioaPath = path.join(cwd, app.path, 'node_modules', 'ioa')

   }

})


const { mixinConfig, replaceMiddleware } = helper

for (const name in apps) {

   const app = apps[name]

   // 供私有ioa模块临时读取的动态容器
   root.component = app

   // 加载组件内私有ioa模块，固化app对应的实例
   try {
      require(app.ioaPath)
   } catch (error) {
      fs.copySync(path.join(cwd, 'node_modules', 'ioa', '.component'), app.ioaPath)
      require(app.ioaPath)
   }

   lloader(app.path, app).set({
      ".import.js": {
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
            config = mixinConfig(config)
            config = T(config).object({ mixin: app._config })
            return config
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