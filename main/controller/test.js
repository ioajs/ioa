'use strict';

class test {
   async index(ctx) {
      ctx.body = 'index'
   }
   async details(ctx) {
      ctx.body = 'details'
   }
   async create(ctx) {
      ctx.body = 'create'
   }
   async update(ctx) {
      ctx.body = 'update'
   }
   async destroy(ctx) {
      ctx.body = 'destroy'
   }
}

module.exports = test