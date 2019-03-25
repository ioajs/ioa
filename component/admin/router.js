'use strict';

const { router, $main } = require('@app');

const { cors } = $main.middleware;

// router.befor(cors);

router.get('/admin', 'home.index');

router.get('/admin/:id', 'home.details');