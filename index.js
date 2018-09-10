'use strict';

const batchImport = require('batch-import')
const { version } = require('./package.json')

// 由于根模块内部存在嵌套引用，因此需要提前导出引用模块执行所必须的依赖
const app = {
   version,
   root: process.cwd(),
   NODE_ENV: process.env.NODE_ENV || 'production'
}

module.exports = app

// 加载主框架
require('./core/main')

// 加载插件框架
require('./core/plugin')

// 合并config
require('./core/config')

// 自定义模块批量加载器
app.loader = function (options) {

   Object.assign(app, batchImport(options))

}

// 启用http服务
app.listen = function (port = app.config.port) {

   let Koa = require('koa')
   let bodyParser = require('koa-bodyparser')
   let router = require('./core/router')

   app.koa = new Koa()
   app.koa.use(bodyParser({ "enableTypes": ['json', 'form', 'text'] }))
   app.koa.use(router)
   app.koa.listen(port)

   console.log(`\n${app.NODE_ENV}`, `http://localhost:${port}`)

}