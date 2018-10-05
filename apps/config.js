'use strict';

module.exports = {
   "base": {
      "enable": true
   },
   "admin": {
      "enable": true
   },
   "db": {
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
      "package": "base-sequelize",
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