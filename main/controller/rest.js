export default class Rest {
   async index(ctx) {
      ctx.body = ctx.params;
   }
   async details(ctx) {
      ctx.body = ctx.params;
   }
   async create(ctx) {
      const body = ctx.request.body;
      ctx.body = body;
   }
   async update(ctx) {
      const body = ctx.request.body;
      ctx.body = {
         body,
         params: ctx.params
      }
   }
   async destroy(ctx) {
      ctx.body = ctx.params;
   }
   /**
    * 在rest中混入普通路由
    * @param {*} ctx 
    */
   async other(ctx) {
      ctx.body = 'other';
   }
}