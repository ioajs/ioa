import ioa from 'ioa';

const { cors } = ioa.main.middleware;

const { router, middleware } = ioa.app();

const { test, intercept } = middleware;

router.get('/user', cors, test, 'home.home');

router.get('/user/:id', cors, test, 'home.details');

router.get('/user/intercept', cors, intercept, 'home.details');
