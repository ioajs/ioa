'use strict';

const root = require('..')

let { NODE_ENV, port, logger } = root

logger.log(`NODE_ENV ${NODE_ENV}`)

if (port === undefined) {

   const { main } = root

   port = main.config.port

   port = port || 8800

   root.port = port

}

root.http = function () {

   require('./router')
   const Koa = require('koa')
   const bodyParser = require('koa-bodyparser')
   const middleware = require('./middleware')

   const koa = new Koa()
   koa.use(bodyParser())
   koa.use(middleware)

   root.koa = koa

   koa.listen(port)

   logger.log(`HTTP http://localhost:${port}`)

}