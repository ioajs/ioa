'use strict';

const ioa = require('ioa');
const { router, middleware } = require('@app');

const { test, intercept } = middleware;
const { cors } = ioa.app.middleware;

router.get('/user', cors, test, 'home.home');

router.get('/user/:id', cors, test, 'home.details');

router.get('/user/intercept', cors, intercept, 'home.details');