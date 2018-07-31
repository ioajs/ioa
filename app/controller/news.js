let { Controller } = require(process.cwd())

class news extends Controller {
   home(ctx) {
      ctx.body = 'news home';
   }
   details(ctx) {
      ctx.body = {
         parameter: ctx.parameter,
         body: 'news details'
      };
   }
}

module.exports = news