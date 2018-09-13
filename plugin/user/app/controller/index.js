const app = require('ioa')

class index {
   home(ctx) {
      ctx.body = 'user home'
   }
}

module.exports = index