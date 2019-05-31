'use strict';

const { router, middleware } = require('@app');

const { token } = middleware;

router.get('/common', token, 'home.index');

router.get('/common/:id', token, 'home.details');