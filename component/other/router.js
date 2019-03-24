'use strict';

const { router, apps } = require('@app');

const { cors } = apps.main.middleware;

router.get('/other', cors, 'home.index')

router.get('/other/:id', cors, 'home.details')