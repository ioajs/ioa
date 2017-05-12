'use strict';

let jwt = require('jsonwebtoken')

module.exports = async (ctx, next, options) => {

  // 登录时跳过token
  if (ctx.url === '/login') {
    await next()
    return
  }

  // 生成测试token
  // let $token = jwt.sign({
  //   id: 1,
  //   sid: 5,
  //   rid: 2
  // }, options.key, { expiresIn: 3600 * 24 * 60 });
  // console.log($token)

  let token = ctx.get('authorization')
  if (!token) {
    ctx.body = { code: 204, error: '无令牌' }
    return
  }

  try {
    jwt.verify(token, options.key)
  } catch (err) {
    ctx.body = { code: 204, error: '令牌无效' }
    return
  }

  // 将解码后的token参数保存到app中，方便跨模块调用
  ctx.token = jwt.decode(token)
  await next()
}