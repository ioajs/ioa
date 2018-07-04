let { Controller } = require('../../../')

class index extends Controller {
   home(ctx) {
      ctx.body = 'home';
   }
   sms(ctx) {
      ctx.body = 'sms';
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