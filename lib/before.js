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



// 尝试加载插件应用
app.pluginPath = path.join(app.root, 'plugin')

try {
   app.pluginConfig = require(path.join(app.pluginPath, 'config.js'))
} catch (error) {
   return
}

T(app.pluginConfig).query({ '*.enable': true }, function (name) {

   const base = path.join('plugin', name)

   const plugin = { parent: app, ...baseApp }

   app.pluginApp = plugin
   app.plugin[name] = plugin

   // 加载插件内ioa模块，导出并缓存每个plugin对应的实例
   try {
      require(path.join(app.pluginPath, name, 'node_modules', 'ioa'))
   } catch (error) {
      app.logger.warn(`${name}插件加载失败`, error)
      return
   }

   batchImport({
      "config": {
         "path": path.join(base, 'config'),
         complete() {
            return mixinConfig(plugin)
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
   }, plugin)

   // 尝试加载io配置文件
   try {
      plugin.io = require(path.join(app.pluginPath, name, 'io'))
   } catch (error) {
      return
   }

   io(plugin.io, plugin, app)

})