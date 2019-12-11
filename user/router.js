'use strict';

const { main } = require('ioa');
const { router, middleware } = require('@app');

const { cors } = main.middleware;
const { test, intercept } = middleware;

router.get('/user', cors, test, 'home.home');

router.get('/user/:id', cors, test, 'home.details');

router.get('/user/intercept', cors, intercept, 'home.details');