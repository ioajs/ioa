'use strict';

const root = require('..')

root.http = function () {

   require('./router')
   const Koa = require('koa')
   const bodyParser = require('koa-bodyparser')
   const router = require('./middleware')

   const koa = new Koa()
   koa.use(bodyParser())
   koa.use(router)

   root.koa = koa

   const { NODE_ENV, app, main } = root

   let port
   if (app) {
      port = app.config.port
   } else if (main) {
      port = main.config.port
   }

   port = port || 8800

   root.port = port

   koa.listen(port)

   console.log(`\n${NODE_ENV}`, `http://localhost:${port}`)

}