'use strict';

const { router, middleware } = require('@app')

const { test, intercept, cors } = middleware

router.get('/user', cors, test, 'index.home')

router.get('/user/:id', cors, test, 'index.details')

router.get('/user/intercept', cors, intercept, 'index.details')