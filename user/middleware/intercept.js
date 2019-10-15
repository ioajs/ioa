'use strict';

module.exports = async (ctx, next) => {
   ctx.body = '中间件拦截'
   // await next()
}