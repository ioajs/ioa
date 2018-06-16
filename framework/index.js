'use strict';

let Koa = require('koa')
let koa = new Koa()
let app = require('./app.js')
let router = require('./router.js')(app)

app.listen = function ({ port = 8800 }) {
   console.log(`http://localhost:${port}/`)
   koa.listen(port)
   koa.use(router)
}

module.exports = app