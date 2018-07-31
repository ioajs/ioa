'use strict';

module.exports = app => {

   let { routerPrefix } = app.config

   // 模糊匹配路由，泛解析，通用模型控制器
   app.resources(`/${routerPrefix}/:name`, 'model')

}