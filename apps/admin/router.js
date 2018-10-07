'use strict';

const app = require('ioa')

const { token, cors } = app.middleware

app.get('/admin', cors, 'index.index')

app.get('/admin/:id', cors, 'index.details')