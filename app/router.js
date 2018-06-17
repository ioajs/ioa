'use strict';

module.exports = app => {

   let { test, token, cors } = app.middleware

   app.get('/', cors, 'index.home')

   app.post('/login', 'index.login')

   app.get('/news', cors, 'news.home')

   app.get('/news/:id/details/:kk', test, 'news.details')

   app.post('/sms/:id/sd/:kk', test, token, 'index.sms')

   
   ////////// REST路由 ////////////

   // 模糊匹配路由，泛解析，通用模型控制器
   app.resources('/rest/:name', 'rest')

}