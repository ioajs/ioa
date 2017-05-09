  // 暂时采用自动匹配模式，此模块不再使用
  // // 检查路由是否存在
  // let state = false
  // for (let key in router) {
  //   if (router[key] === ctx.url) {
  //     state = true
  //     break
  //   }
  // }
  // if (state) {
  //   await next();
  // } else {
  //   ctx.body = '路径不存在';
  // }
  
  module.exports = {
  home: '/home',
  user: '/user',
  admin: '/admin',
  goods: '/goods'
}
