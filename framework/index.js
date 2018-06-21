'use strict';

let Koa = require('koa')
let koa = new Koa()
let app = require('./app.js')
let router = require('./middleware/router.js')(app)

let { config } = app

app.listen = function ({ port = config.port }) {
   console.log(`http://localhost:${port}/`)
   koa.listen(port)
   koa.use(router)
}

module.exports = app