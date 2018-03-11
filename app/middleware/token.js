'use strict';

module.exports = async (ctx, next) => {
   console.log('我是token中间件 - 前置')
   await next()
   console.log('我是token中间件 - 后置')
}