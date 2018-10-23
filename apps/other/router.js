'use strict';

const { router, middleware } = require('ioa')

const { token, cors } = middleware

// console.log(cors)

router.get('/other', 'index.index')

router.get('/other/:id', 'index.details')