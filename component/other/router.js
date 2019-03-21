'use strict';

const { main } = require('ioa');
const { router } = require('@app');

const { cors } = main.middleware;

// logger.log(cors)

router.get('/other', 'home.index')

router.get('/other/:id', 'home.details')