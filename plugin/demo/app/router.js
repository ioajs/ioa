'use strict';

module.exports = app => {

   let { test, token } = app.middleware

   // 模糊匹配路由，泛解析，通用模型控制器
   app.resources('/model/:name', 'model', 'model')

}