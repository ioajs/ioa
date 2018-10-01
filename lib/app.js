'use strict';

const logger = require('loggercc')
const { version } = require('../package.json')

module.exports = {
   version,
   root: process.cwd(),
   NODE_ENV: process.env.NODE_ENV || 'production',
   logger,
   components: {}
}