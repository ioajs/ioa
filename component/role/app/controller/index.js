'use strict';

class index {
   async index(ctx) {
      ctx.body = 'role index'
   }
   async details(ctx) {
      ctx.body = 'role details'
   }
   async add(ctx) {
      ctx.body = 'role add'
   }
   async update(ctx) {
      ctx.body = 'role update'
   }
   async delete(ctx) {
      ctx.body = 'role delete'
   }
}

module.exports = index