'use strict';

const { app } = require('ioa');
const { router } = require('@app');

const { cors } = app.middleware;

// logger.log(cors)

router.get('/other', 'home.index')

router.get('/other/:id', 'home.details')