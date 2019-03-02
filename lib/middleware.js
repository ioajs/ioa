'use strict';

const { container, logger } = require('..');

/**
 * koa路由参数解析、路由分发中间件
 * @param {Object} ctx 请求上下文
 */
module.exports = async ctx => {

   ctx.params = {}

   let iterative = container

   // 通过path路径查找中间件
   const [, ...pathArray] = ctx.path.split('/')

   for (const path of pathArray) {

      const item = iterative[path]

      if (item) {
         iterative = item
      }

      // 当path不匹配时，尝试用<*>号填充
      else if (iterative['<*>']) {
         iterative = iterative['<*>']
         ctx.params[iterative['<name>']] = path
      } else {
         ctx.body = {
            code: 1000,
            msg: '资源不存在'
         }
         return
      }

   }

   if (iterative instanceof Object) {

      iterative = iterative["<middleware>"]

      if (iterative) {

         let middleware = iterative[ctx.method]

         // 未匹配到中间件
         if (!middleware) {
            if (ctx.method === 'OPTIONS') {
               ctx.status = 204
               const method = ctx.request.header["access-control-request-method"]
               middleware = iterative[method]
               if (middleware) {
                  // 创建新副本，并从副本中删除controller，避免无意义的执行controller
                  middleware = [...middleware]
                  middleware.pop()
               } else {
                  return
               }
            } else {
               ctx.status = 500
               return
            }
         }

         let index = -1

         // 含状态锁的next()递进器，防止重复调用
         async function next() {
            const item = middleware[index + 1]
            if (item) {
               let lock = true
               await item(ctx, async () => {
                  if (lock) {
                     lock = false
                     index++
                     await next()
                  }
               })
            }
         }

         await next().catch(error => {
            logger.error(error);
            ctx.body = {
               code: 1000,
               message: String(error)
            }
         })

      }

   }

}