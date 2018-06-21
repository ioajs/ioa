'use strict';

module.exports = app => {

   let { test, token } = app.middleware

   // app.get('/', cors, 'index.home')

   // app.post('/login', 'index.login')

   // app.get('/news', cors, 'news.home')

   // app.get('/news/:id/details/:kk', test, 'news.details')

   // app.get('/sms/:id/sd/:kk', 'index.sms')

   // app.post('/sms/:id/sd/:kk', test, token, 'index.sms')


   ////////// REST路由 ////////////

   // 模糊匹配路由，泛解析，通用模型控制器
   app.resources('/rest/:name', 'rest')

}