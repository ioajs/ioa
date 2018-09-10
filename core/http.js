'use strict';

const app = require('..')

app.listen = function (port = app.config.port) {

   let Koa = require('koa')
   let bodyParser = require('koa-bodyparser')
   let router = require('./core/router')

   app.koa = new Koa()
   app.koa.use(bodyParser({ "enableTypes": ['json', 'form', 'text'] }))
   app.koa.use(router)

   app.koa.listen(port)

   console.log(`http://localhost:${port}/`, app.NODE_ENV)

}