'use strict';

const { router } = require('@app');

router.get('/common', 'token', 'home.index');

router.get('/common/:id', 'token', 'home.details');