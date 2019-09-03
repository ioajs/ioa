'use strict';

module.exports = {
   "@ioa/koa": {
      "port": 8600
   },
   "@ioa/model": {
      "host": "localhost",
      "port": 5432,
      "database": "test",
      "username": "postgres",
      "password": "postgres",
      "logger": true
   },
   "@ioa/auth": {
      "password": "test"
   },
   "mixin": {
      a: 666
   },
}