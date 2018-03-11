module.exports = app => {
   return {
      home(ctx) {
         ctx.body = 'home';
      },
      sms(ctx) {
         ctx.body = 'sms';
      },
      login(ctx) {
         ctx.body = 'login';
      }
   }
}