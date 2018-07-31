let { Controller } = require(process.cwd())

class index extends Controller {
   home(ctx) {
      ctx.body = 'home';
   }
   sms(ctx) {
      ctx.body = ctx.parameter;
   }
   login(ctx) {
      let body = ctx.request.body
      ctx.body = {
         type: 'login',
         body
      };
   }
}

module.exports = index