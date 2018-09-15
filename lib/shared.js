'use strict';

const path = require('path')
const T = require('small-tools')
const batchImport = require('batch-import')
const { mixinConfig } = require('./helper')
const app = require('..')

// 加载主应用
batchImport({
   "config": {
      "path": "config/",
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


/**
 * 尝试加载插件应用
 */

app.pluginPath = path.join(app.root, 'plugin')


try {
   app.pluginConfig = require(path.join(app.pluginPath, 'config.js'))
} catch (error) {
   return
}

T(app.pluginConfig).query({ '*.enable': true }, function (name) {

   const base = path.join('plugin', name)

   const plugin = Object.create(app)

   plugin.parent = app
   plugin.config = T(app.config).clone()

   app.plugin[name] = plugin
   app.currentPlugin = plugin

   // 加载插件内ioa模块，导出并每个plugin对应的实例
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

})