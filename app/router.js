'use strict';

const app = require(process.cwd())

const { token, roles } = app.middleware

app.get('/', 'index.home')

app.post('/login', token, 'index.login')

app.get('/news', 'news.home')

app.get('/news/:id/details/:kk', token, 'news.details')

app.get('/sms/:id/sd/:kk', 'index.sms')

app.post('/sms/:id/sd/:kk', token, 'index.sms')

app.get('/admin', 'admin.index.details')

////////// REST路由 ////////////

app.resources('/rest', 'rest')

// app.get('/rest/other', 'rest.other')