'use strict';

const app = require('ioa')

class index {
   home(ctx) {
      ctx.body = 'user home'
   }
   details(ctx) {
      ctx.body = 'user details'
   }
}

module.exports = index