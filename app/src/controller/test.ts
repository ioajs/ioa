import { main } from 'ioa';

const { controller, config } = main;

// console.log(controller)
// console.log(config)

class Test {
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

