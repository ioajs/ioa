'use strict';

// let app = require('newseed')

let app = require('./framework/')

app.listen({ port: 8800 })

console.log(app.config)