'use strict';

const app = require('ioa')

const { test, intercept } = app.middleware

app.get('/user', test, 'index.home')

// app.get('/user/news', test, 'news.details')

// app.get('/user/intercept', intercept, 'news.details')