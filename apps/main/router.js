'use strict';

const { router, middleware, controller } = require('@app')

const { token, role } = middleware

const { index, news } = controller

router.get('/', index.home)

router.post('/login', token, index.login)

router.get('/news', news.home)

router.get('/news/:id/details/:kk', token, 'news.details')

router.get('/sms/:id/sd/:kk', 'index.sms')

router.post('/sms/:id/sd/:kk', token, index.sms)

////////// REST路由 ////////////

router.resources('/rest', 'rest')

// router.get('/rest/other', 'rest.other')