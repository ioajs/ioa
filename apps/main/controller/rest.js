'use strict';

const { Controller } = require('ioa')

class rest extends Controller {
   async index(ctx) {
      ctx.body = ctx.parameter
   }
   async details(ctx) {
      ctx.body = ctx.parameter
   }
   async create(ctx) {
      let body = ctx.request.body
      ctx.body = body
   }
   async update(ctx) {
      let body = ctx.request.body
      ctx.body = {
         body,
         parameter: ctx.parameter
      }
   }
   async destroy(ctx) {
      ctx.body = ctx.parameter
   }
   /**
    * 在rest中混入普通路由
    * @param {*} ctx 
    */
   async other(ctx) {
      ctx.body = 'other'
   }
}

module.exports = rest