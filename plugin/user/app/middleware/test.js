'use strict';

module.exports = async (ctx, next) => {
   console.log('我是user test中间件')
   await next()
}