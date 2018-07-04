'use strict';

let app = require('./core/')

module.exports = app

// 批量加载模块（必须优先导出app对象，否则模块无法访问app）
require('./core/loader')

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