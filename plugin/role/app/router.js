'use strict';

const app = require('ioa')

const { test, token } = app.middleware

app.get('/role', 'ssh.details')