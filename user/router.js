import ioa from 'ioa';

const { main, app } = ioa;

const { router, middleware } = app;

const { cors } = main.middleware;
const { test, intercept } = middleware;

router.get('/user', cors, test, 'home.home');

router.get('/user/:id', cors, test, 'home.details');

router.get('/user/intercept', cors, intercept, 'home.details');
