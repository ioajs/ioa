module.exports = app => {

   return {
      async index(ctx) {
         ctx.body = 'index'
      },
      async details(ctx) {
         ctx.body = 'details'
      },
      async add(ctx) {
         ctx.body = 'add'
      },
      async update(ctx) {
         ctx.body = 'update'
      },
      async delete(ctx) {
         ctx.body = 'delete'
      }
   }

}