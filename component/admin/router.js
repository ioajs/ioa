'use strict';

const { router, apps } = require('@app');

const { cors } = apps.main.middleware;

// router.befor(cors);

router.get('/admin', 'home.index');

router.get('/admin/:id', 'home.details');