class index {
   index(ctx) {
      let body = ctx.request.body
      ctx.body = {
         type: 'push',
         body
      };
   }
}

module.exports = index