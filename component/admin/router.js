'use strict';

const { app } = require('ioa');
const { router } = require('@app');

const { cors } = app.middleware;

// router.befor(cors);

router.get('/admin', 'home.index');

router.get('/admin/:id', 'home.details');