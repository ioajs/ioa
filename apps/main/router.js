'use strict';

const { router, middleware } = require('ioa')

const { token, role } = middleware

router.get('/', 'index.home')

router.post('/login', token, 'index.login')

router.get('/news', 'news.home')

router.get('/news/:id/details/:kk', token, 'news.details')

router.get('/sms/:id/sd/:kk', 'index.sms')

router.post('/sms/:id/sd/:kk', token, 'index.sms')

////////// REST路由 ////////////

router.resources('/rest', 'rest')

// router.get('/rest/other', 'rest.other')