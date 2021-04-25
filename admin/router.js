import ioa from 'ioa';

const { main, app } = ioa;

const { router } = app;

const { cors } = main.middleware;

// router.befor(cors);

router.get('/admin', 'home.index');

router.get('/admin/:id', 'home.details');
