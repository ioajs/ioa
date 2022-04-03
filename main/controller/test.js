import { main, apps } from 'ioa';

// console.log(apps.main === main)

const { controller, config } = main;

// console.log(controller)
// console.log(config)

export default class {
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
