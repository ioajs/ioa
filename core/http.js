'use strict';

const app = require('..')

app.listen = function (port = app.config.port) {

   const Koa = require('koa')
   const bodyParser = require('koa-bodyparser')
   const router = require('./middleware/router')

   app.koa = new Koa()
   app.koa.use(bodyParser({ "enableTypes": ['json', 'form', 'text'] }))
   app.koa.use(router)
   app.koa.listen(port)

   console.log(`\n${app.NODE_ENV}`, `http://localhost:${port}`)

}