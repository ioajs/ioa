import ioa from 'ioa';

const { router } = ioa.app();

router.get('/common', 'token', 'home.index');
router.get('/common/:id', 'token', 'home.details');
