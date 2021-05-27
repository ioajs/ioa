import ioa from 'ioa';

const { extend } = ioa.app;

const { Controller, Base } = extend;

class Home extends Controller {
   index(ctx) {
      this.test();
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
}

export default Home;