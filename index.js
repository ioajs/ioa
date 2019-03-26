'use strict';

const logger = require('loggercc');
const { version } = require('./package.json');

const NODE_ENV = process.env.NODE_ENV || 'production';

const ioa = {
   version,
   logger,
   apps: {},
   components: {},
   cwd: process.cwd(),
   NODE_ENV,
   /**
    * 加载应用
    */
   loader() {
      require('./lib/loader');
   }
}

console.log('');
logger.log(`NODE_ENV = ${NODE_ENV}`);

module.exports = ioa;