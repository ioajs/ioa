'use strict';

const { main } = require('ioa');
const { router } = require('@app');

const { cors } = main.middleware;

// router.befor(cors);

router.get('/admin', 'home.index');

router.get('/admin/:id', 'home.details');
