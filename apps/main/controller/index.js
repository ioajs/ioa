'use strict';

const { Controller } = require('@app')

class index extends Controller {
   home(ctx) {
      ctx.body = 'home';
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
}

module.exports = index