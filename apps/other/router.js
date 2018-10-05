'use strict';

const app = require('ioa')

const { token, cors } = app.middleware

// console.log(cors)

app.get('/other', 'index.index')

app.get('/other/:id', 'index.details')