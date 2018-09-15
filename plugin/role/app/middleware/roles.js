'use strict'

/**
 * 模型、权限验证中间件
 */
const jwt = require('jsonwebtoken')
const app = require('ioa')

/**
 * 角色模型签名、权限验证
 */
module.exports = async function (ctx, next) {

   let auth = ctx.get('authorization')

   let { name } = ctx.parameter

   // 带签名用户
   if (auth) {

      ctx.auth = jwt.decode(auth)

      // 获取指定角色
      let role = app.roles[ctx.auth.role];
      if (role) {

         // 获取角色中指定模型的权限
         ctx.roleModel = role[name]
         if (ctx.roleModel) {

            // 验证签名
            try {
               jwt.verify(auth, "lixiang")
            } catch (err) {
               ctx.body = {
                  msg: '签名无效',
                  code: 1000,
               }
               return
            }

            ctx.model = ctx.roleModel.model
            await next()
            
         } else {

            ctx.body = {
               code: 1000,
               msg: '无操作权限',
            }

         }

      } else {

         ctx.body = {
            code: 1000,
            msg: '角色不存在',
         }

      }

   }

   // 游客
   else {

      // 访问固定的tourist游客权限分组
      ctx.roleModel = app.roles.tourist[name]
      
      if (ctx.roleModel) {
         ctx.model = ctx.roleModel.model
         await next()
      } else {
         ctx.body = {
            code: 1000,
            msg: '游客禁止访问',
         }
         return
      }

   }

}