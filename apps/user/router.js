'use strict';

const app = require('ioa')

const { test, intercept, cors } = app.middleware

// console.log(cors)

app.get('/user', test, 'index.home')

app.get('/user/:id', test, 'index.details')

app.get('/user/intercept', intercept, 'index.details')