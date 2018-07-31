'use strict';

// 由于根模块内部存在嵌套引用，因此至少要提前导出引用模块执行所必须的依赖
module.exports = require('./core/app')

// 批量加载框架指定模块
let app = require('./core/loader')

// 启用http服务
app.listen = function (port = app.config.port) {

   let Koa = require('koa')
   let bodyParser = require('koa-bodyparser')
   let router = require('./core/router')

   app.koa = new Koa()
   app.koa.use(bodyParser({ "enableTypes": ['json', 'form', 'text'] }))
   app.koa.use(router)

   app.koa.listen(port)

   console.log(`http://localhost:${port}/`, app.NODE_ENV)

}