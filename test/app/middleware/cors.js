/**
 * package形态的中间件
 */

let cors = require('@koa/cors')

module.exports = cors({ origin: '*' })