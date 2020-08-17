'use strict';

module.exports = class {
   index(ctx) {
      ctx.body = 'index';
   }
   sms(ctx) {
      ctx.body = ctx.params;
   }
   login(ctx) {
      let body = ctx.request.body
      ctx.body = {
         type: 'login',
         body
      };
   }
};