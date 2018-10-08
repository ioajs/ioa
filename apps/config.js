'use strict';

module.exports = {
   "base": {
      "enable": true
   },
   "db": {
      "enable": true
   },
   "admin": {
      "enable": true
   },
   "other": {
      "enable": true
   },
   "user": {
      "enable": true
   },
   "sequelize": {
      "enable": false,
      "package": "io-db",
      "config": {
         "dialect": "postgres",
         "host": "localhost",
         "database": "estate",
         "username": "postgres",
         "password": "xiangle",
         "port": 5432
      }
   }
}