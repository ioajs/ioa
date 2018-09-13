'use strict';

const app = require('ioa')

const { test, token } = app.middleware

app.get('/user', test, 'index.home')

app.get('/user/news', test, 'news.details')