'use strict';

let app = require('./core/')

module.exports = app

// 批量加载模块必须在导出app后进行，否则提前引用的app处于未定义状态
require('./core/loader')

// 启用http服务
app.listen = function ({ port = app.config.port }) {

   let Koa = require('koa')
   let bodyParser = require('koa-bodyparser')
   let router = require('./core/router')(app, '/app/router.js')

   app.koa = new Koa()
   app.koa.listen(port)
   app.koa.use(bodyParser({ "enableTypes": ['json', 'form', 'text'] }))
   app.koa.use(router)

   console.log(`http://localhost:${port}/`)

}