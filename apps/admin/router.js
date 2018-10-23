'use strict';

const { router, middleware } = require('ioa')

const { cors } = middleware

router.get('/admin', cors, 'index.index')

router.get('/admin/:id', cors, 'index.details')