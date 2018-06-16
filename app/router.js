'use strict';

module.exports = app => {

   let { test, token } = app.middleware

   app.get('/', 'index.home')

   app.get('/sms', 'index.sms')

   app.post('/login', 'index.login')

   app.get('/sms/:id/sd/:kk', test, 'index.sms')

   app.post('/sms/:id/sd/:kk', test, token, 'index.sms')

   ////////// REST路由 ////////////

   // 模糊匹配路由，泛解析，通用模型控制器
   // app.resources('/model/:modelName', 'model', 'model')

}