'use strict';

let app = require('./core/loader')

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

module.exports = app