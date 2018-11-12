'use strict';

const path = require('path')
const T = require('ttools')
const lloader = require('lloader')
const fs = require('fs-extra')
const root = require('..')
const helper = require('./helper')
const Model = require('./extends/model')
const Controller = require('./extends/controller')
const Import = require('./import')

const { apps, cwd, version } = root

try {
   var PackageIo = require(path.join(cwd, 'ioa.config'))
} catch (error) {
   var PackageIo = {}
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
T(PackageIo).query({ '*.enable': true }, (name, item) => {

   const { config: _config = {}, path: _path, package: _package } = item

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

   // npm组件模块
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

   // 临时读取模块作用域ioa容器
   root.scope = app

   // 模块作用域ioa依赖注入、版本对比、版本同步
   try {
      const pack = require(path.join(app.ioaPath, 'package.json'))
      if (pack.version !== version) {
         throw null
      }
   } catch (error) {
      fs.outputFileSync(path.join(app.ioaPath, 'package.json'),
         `{"version": "${version}","main": "index.js"}`
      );
      fs.outputFileSync(path.join(app.ioaPath, 'index.js'),
         `'use strict';const path = require('path');const ioa = require(path.join(process.cwd(), 'node_modules', 'ioa'));module.exports = ioa.scope;`
      );
   }

   // 导出、固化组件作用域内的ioa模块
   require(app.ioaPath)

   lloader(app.path, app).set({
      ".import.js": {
         "level": 0,
         module(options) {
            const error = Import(options, app)
            if (error) {
               throw new Error(`${name}组件${error}`)
            }
         }
      },
      "config": {
         "level": 10,
         directory(config) {
            config = T(config).object({ mixin: app._config })
            return mixinConfig(config)
         }
      },
      "model": {
         "level": 20,
      },
      "middleware": {
         "level": 30,
         after() {
            replaceMiddleware(app)
         }
      },
      "service": {
         "level": 40,
      },
      "controller": {
         "level": 50,
         module(func) {
            if (func.prototype) {
               return new func()
            }
            return func
         }
      },
      "router.js": false
   })

}

lloader.load(function (errorInfo) {

})