'use strict';

const base = require('./base')

base.listen = function (port = app.port) {

   require('./router')
   const router = require('./middleware')
   const Koa = require('koa')
   const bodyParser = require('koa-bodyparser')

   base.koa = new Koa()
   base.koa.use(bodyParser({ "enableTypes": ['json', 'form', 'text'] }))
   base.koa.use(router)
   base.koa.listen(port)

   console.log(`\n${base.NODE_ENV}`, `http://localhost:${port}`)

}