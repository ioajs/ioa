'use strict';

const root = require('..')

root.listen = function (port = root.port) {

   require('./router')
   const router = require('./middleware')
   const Koa = require('koa')
   const bodyParser = require('koa-bodyparser')

   root.koa = new Koa()
   root.koa.use(bodyParser({ "enableTypes": ['json', 'form', 'text'] }))
   root.koa.use(router)
   root.koa.listen(port)

   console.log(`\n${root.NODE_ENV}`, `http://localhost:${port}`)

}