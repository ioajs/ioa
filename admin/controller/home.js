'use strict';

class Index {
   async index(ctx) {
      ctx.body = 'admin index';
   }
   async details(ctx) {
      ctx.body = 'admin details';
   }
   async add(ctx) {
      ctx.body = 'admin add';
   }
   async update(ctx) {
      ctx.body = 'admin update';
   }
   async delete(ctx) {
      ctx.body = 'admin delete';
   }
}

module.exports = Index;