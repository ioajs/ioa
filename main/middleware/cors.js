'use strict';

/**
 * package形态的中间件
 */

const cors = require('@koa/cors')

module.exports = cors({ origin: '*' });