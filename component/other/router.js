'use strict';

const { router, $main } = require('@app');

const { cors } = $main.middleware;

router.get('/other', cors, 'home.index')

router.get('/other/:id', cors, 'home.details')