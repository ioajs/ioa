'use strict';

const app = require('./app')

app.listen = function (port = app.config.port) {

   require('./router')
   const router = require('./middleware')
   const Koa = require('koa')
   const bodyParser = require('koa-bodyparser')

   app.koa = new Koa()
   app.koa.use(bodyParser({ "enableTypes": ['json', 'form', 'text'] }))
   app.koa.use(router)
   app.koa.listen(port)

   console.log(`\n${app.NODE_ENV}`, `http://localhost:${port}`)

}