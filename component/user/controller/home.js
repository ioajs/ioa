'use strict';

class index {
   home(ctx) {
      ctx.body = 'user home'
   }
   details(ctx) {
      ctx.body = 'user details'
   }
}

module.exports = index