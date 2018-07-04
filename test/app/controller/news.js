module.exports = app => {
   return {
      home(ctx) {
         ctx.body = 'news home';
      },
      details(ctx) {
         ctx.body = {
            parameter: ctx.parameter,
            body: 'news details'
         };
      }
   }
}