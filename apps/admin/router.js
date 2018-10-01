'use strict';

const app = require('ioa')

const { token, roles } = app.middleware

app.get('/admin', 'index.index')

app.get('/admin/:id', 'index.details')