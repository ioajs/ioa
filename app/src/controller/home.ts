import { Controller, Get, Post } from '@ioa/api';

@Controller()
class Home {
   @Get('/')
   index(ctx) {
      // this.test();
      ctx.body = 'index';
   }
   @Get('/sms/:id/sd/:kk')
   @Post('/sms/:id/sd/:kk')
   sms(ctx) {
      ctx.body = ctx.params;
   }
}
