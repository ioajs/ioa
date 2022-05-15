import { app } from 'ioa';

const { router } = app();

router.get('/common', 'token', 'home.index');
router.get('/common/:id', 'token', 'home.details');
