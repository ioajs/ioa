'use strict';

const { router, middleware } = require('@app')

const { cors } = middleware

router.get('/admin', cors, 'index.index')

router.get('/admin/:id', cors, 'index.details')