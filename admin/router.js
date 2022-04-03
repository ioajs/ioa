import { components, app } from 'ioa';

const { cors } = components['@common'].middleware;

const { router } = app();

// router.befor(cors);

router.get('/admin', 'home.index');

router.get('/admin/:id', 'home.details');
