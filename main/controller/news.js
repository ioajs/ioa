'use strict';

class news {
   index(ctx) {
      ctx.body = 'news index';
   }
   details(ctx) {
      ctx.body = {
         params: ctx.params,
         body: 'news details'
      };
   }
}

module.exports = news