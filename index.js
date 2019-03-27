'use strict';

const logger = require('loggercc');
const loader = require('./lib/loader.js');
const { version } = require('./package.json');

const NODE_ENV = process.env.NODE_ENV || 'production';

const ioa = {
   version,
   logger,
   apps: {},
   components: {},
   cwd: process.cwd(),
   NODE_ENV,
   loader
}

console.log('');
logger.log(`NODE_ENV = ${NODE_ENV}`);

module.exports = ioa;