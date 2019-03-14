'use strict';

const path = require('path');
const T = require('ttools');
const fs = require('fs-extra');
const loader = require('lloader');
const root = require('..');
const helper = require('./helper');
const Model = require('./extends/model');
const Controller = require('./extends/controller');
const Import = require('./import');

const { apps, cwd, version } = root

let ioConfig = {}

try {
   ioConfig = require(path.join(cwd, 'ioa.config'))
} catch (error) {

}

// 多应用模式
try {

   fs.accessSync(path.join(cwd, 'apps'))

   root.mode = 'apps'

   ioConfig.main = {
      "enable": true
   }

}

// 单应用模式
catch (error) {

   root.mode = 'app'

   ioConfig.app = {
      "enable": true
   }

}

// 预构建app容器
T(ioConfig).query({ '*.enable': true }, (name, item) => {

   const { config: _config = {}, package: _package, path: _path } = item

   const app = {
      name,
      ...root,
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

   // 自定义Path组件（相对路径）
   if (_path) {

      app.path = _path
      app.scopePath = path.join(_path, 'node_modules', '@app')

   }

   // npm组件
   else if (_package) {

      app.path = path.join(cwd, 'node_modules', _package, 'app')
      app.scopePath = path.join(cwd, 'node_modules', _package, 'node_modules', '@app')

   }

   else {

      if (root.mode === 'apps') {
         app.path = path.join(cwd, 'apps', name)
      } else {
         app.path = path.join(cwd, 'app')
      }

      app.scopePath = path.join(app.path, 'node_modules', '@app')

   }

})

const { mixinConfig, replaceMiddleware } = helper

for (const name in apps) {

   const app = apps[name];

   // 临时读取模块作用域ioa容器
   root.scope = app

   // 模块作用域ioa依赖注入、版本对比、版本同步
   try {
      const pack = require(path.join(app.scopePath, 'package.json'))
      if (pack.version !== version) {
         throw null
      }
   } catch (error) {
      fs.outputFileSync(path.join(app.scopePath, 'package.json'),
         `{"version": "${version}","main": "index.js"}`
      );
      fs.outputFileSync(path.join(app.scopePath, 'index.js'),
         `'use strict';const path = require('path');const ioa = require(path.join(process.cwd(), 'node_modules', 'ioa'));module.exports = ioa.scope;`
      );
   }

   // 加载、固化组件作用域内的app模块
   require(app.scopePath);

   loader(app.path, app).set({
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

if (apps.main) {
   root.main = apps.main;
} else if (apps.app){
   root.main = apps.app;
}

loader.load(function (errorInfo) {

})