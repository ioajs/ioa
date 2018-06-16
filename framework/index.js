'use strict';

let Koa = require('koa')
let koa = new Koa()
let app = require('./app.js')
let router = require('./router.js')(app)

app.listen = function ({ port = 8800 }) {
   koa.listen(port)
   console.log(`http://localhost:${port}/`)
   koa.use(async function (ctx, next) {
      router(ctx, next)
   })
}

module.exports = app