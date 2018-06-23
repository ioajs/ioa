'use strict';

let bodyParser = require('koa-bodyparser')
let app = require('./loader')

app.listen = function ({ port = app.config.port }) {

   let Koa = require('koa')
   let router = require('./router')(app)

   app.koa = new Koa()
   app.koa.listen(port)
   app.koa.use(bodyParser({ "enableTypes": ['json', 'form', 'text'] }))
   app.koa.use(router)
   console.log(`http://localhost:${port}/`)

}

module.exports = app