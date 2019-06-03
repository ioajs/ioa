'use strict';

module.exports = {
   "mixin": {
      a: 666
   },
   'components': {
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
         "authKey": "test"
      }
   }
}