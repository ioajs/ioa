import ioa from 'ioa';

const { main } = ioa;

const { router } = ioa.app();

const { cors } = main.middleware;

// router.befor(cors);

router.get('/admin', 'home.index');

router.get('/admin/:id', 'home.details');
