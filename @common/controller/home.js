'use strict';

class index {
   async index(ctx) {
      ctx.body = 'common index'
   }
   async details(ctx) {
      ctx.body = 'common details'
   }
   async add(ctx) {
      ctx.body = 'common add'
   }
   async update(ctx) {
      ctx.body = 'common update'
   }
   async delete(ctx) {
      ctx.body = 'common delete'
   }
}

module.exports = index