import { app } from 'ioa';

const { router, middleware, controller } = app();

const { token, cors } = middleware;

const { home, news } = controller;

router.global(cors);

router.get('/', home.index);

router.post('/login', token, 'home.login');

router.get('/news', news.index);

router.get('/news/:id/details/:kk', token, 'news.details');

router.get('/sms/:id/sd/:kk', 'home.sms');

router.post('/sms/:id/sd/:kk', token, home.sms);

////////// REST路由 ////////////

router.resources('/rest', 'rest');

// router.get('/rest/other', 'rest.other');
