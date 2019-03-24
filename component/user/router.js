'use strict';

const { router, middleware, apps } = require('@app');

const { test, intercept } = middleware;
const { cors } = apps.main.middleware;

router.get('/user', cors, test, 'home.home');

router.get('/user/:id', cors, test, 'home.details');

router.get('/user/intercept', cors, intercept, 'home.details');