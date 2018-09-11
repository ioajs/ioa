'use strict';

const { container } = require('../..')

/**
 * koa路由参数解析、路由分发中间件
 * @param {Object} ctx 请求上下文
 */
module.exports = async (ctx) => {

   ctx.parameter = {}

   let iterative = container

   // 通过path路径查找中间件
   let [, ...pathArray] = ctx.path.split('/')
   for (let path of pathArray) {
      let item = iterative[path]
      if (item) {
         iterative = item
      }
      // 当参数不存在时，尝试用*号填充
      else if (iterative['<*>']) {
         iterative = iterative['<*>']
         ctx.parameter[iterative['<name>']] = path
      } else {
         ctx.body = '资源不存在'
         return
      }
   }

   if (iterative instanceof Object) {

      iterative = iterative["<middlewares>"]

      if (iterative) {

         let middlewares = iterative[ctx.method]

         // 未匹配到中间件
         if (!middlewares) {
            if (ctx.method === 'OPTIONS') {
               ctx.status = 204
               let method = ctx.request.header["access-control-request-method"]
               middlewares = iterative[method]
               if (middlewares) {
                  // 创建新副本，并从副本中删除controller，避免无意义的执行controller
                  middlewares = [...middlewares]
                  middlewares.pop()
               } else {
                  return
               }
            } else {
               ctx.status = 500
               return
            }
         }

         let index = 0

         // 含状态锁的next递归器，防止next()被重复调用
         async function next() {
            let middleware = middlewares[index + 1]
            if (middleware) {
               let lock = true
               await middleware(ctx, () => {
                  if (lock) {
                     lock = false
                     index++
                     next()
                  }
               })
            }
         }

         await next()

      }

   }

}