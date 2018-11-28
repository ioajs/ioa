'use strict';

const root = require('..')

let { NODE_ENV, port } = root

console.log(`\nNODE_ENV ${NODE_ENV}`)

if (port === undefined) {

   const { app, main } = root

   if (app) {
      port = app.config.port
   } else if (main) {
      port = main.config.port
   }

   port = port || 8800

   root.port = port

}

root.http = function () {

   require('./router')
   const Koa = require('koa')
   const bodyParser = require('koa-bodyparser')
   const router = require('./middleware')

   const koa = new Koa()
   koa.use(bodyParser())
   koa.use(router)

   root.koa = koa

   koa.listen(port)

   console.log(`HTTP http://localhost:${port}`)

}