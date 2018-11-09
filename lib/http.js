'use strict';

const root = require('..')

root.http = function () {

   require('./router')
   const Koa = require('koa')
   const bodyParser = require('koa-bodyparser')
   const router = require('./middleware')

   root.koa = new Koa()
   root.koa.use(bodyParser())
   root.koa.use(router)

   const { NODE_ENV, app } = root

   const { port = 8800 } = app.config

   root.port = port

   root.koa.listen(port)

   console.log(`\n${NODE_ENV}`, `http://localhost:${port}`)

}