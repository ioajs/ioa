let { Controller } = require('@app')

class news extends Controller {
   home(ctx) {
      ctx.body = 'news home';
   }
   details(ctx) {
      ctx.body = {
         params: ctx.params,
         body: 'news details'
      };
   }
}

module.exports = news