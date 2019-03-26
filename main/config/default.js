'use strict';

module.exports = {
   "port": 8600,
   "mixin": {
      a: 666
   },
   '@components': {
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