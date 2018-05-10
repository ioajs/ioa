'use strict';

let KOA = new require('koa')
let koa = new KOA()
let app = require('./app.js')
let router = require('./router.js')(app)

app.listen = function ({ port = 8800 }) {
   koa.listen(port)
   console.log(`http://localhost:${port}/`)
}

module.exports = app