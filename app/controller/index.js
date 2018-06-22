module.exports = app => {
   return {
      home(ctx) {
         ctx.body = 'home';
      },
      sms(ctx) {
         ctx.body = 'sms';
      },
      login(ctx) {
         let body = ctx.request.body
         ctx.body = {
            type: 'login',
            body
         };
      }
   }
}