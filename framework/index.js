'use strict';

let Koa = require('koa')
let bodyParser = require('koa-bodyparser')
let app = require('./app.js')
let router = require('./middleware/router.js')(app)
let koa = new Koa()

let { config } = app

app.listen = function ({ port = config.port }) {
   console.log(`http://localhost:${port}/`)
   koa.listen(port)
   koa.use(bodyParser({ "enableTypes": ['json', 'form', 'text'] }))
   koa.use(router)
}

module.exports = app