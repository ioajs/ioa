'use strict';

module.exports = {
   "admin": {
      "enable": true
   },
   "other": {
      "enable": true
   },
   "user": {
      "enable": true
   },
   "db": {
      "enable": true,
      "package": "ioa-db",
      "config": {
         "default": {
            "host": "localhost",
            "database": "test",
            "username": "postgres",
            "password": "postgres"
         },
         "localhost": {
            "host": "localhost",
            "database": "test",
            "username": "postgres",
            "password": "postgres"
         },
         "development": {
            "host": "localhost",
            "database": "test",
            "username": "postgres",
            "password": "postgres"
         },
         "production": {
            "host": "localhost",
            "database": "test",
            "username": "postgres",
            "password": "postgres"
         }
      }
   }
}