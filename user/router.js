import { app, components } from 'ioa';

const { router, middleware } = app();

const { test, intercept } = middleware;
const { cors } = components['@common'].middleware;

router.get('/user', cors, test, 'home.home');

router.get('/user/:id', cors, test, 'home.details');

router.get('/user/intercept', cors, intercept, 'home.details');
