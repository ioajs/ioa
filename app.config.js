'use strict';

module.exports = {
   "./main": {
      "enable": true,
      "components": {
         "@ioa/http": {
            "enable": true
         },
         "@ioa/model": {
            "enable": true,
         },
         "@ioa/auth": {
            "enable": true,
         },
      },
   },
   "./component/admin": {
      "enable": true,
      "components": {
         "@ioa/http": {
            "enable": true
         },
         "@ioa/model": {
            "enable": true,
         },
         "@ioa/auth": {
            "enable": true,
         },
      },
   },
   "./component/other": {
      "enable": true,
      "components": {
         "@ioa/http": {
            "enable": true
         },
      },
   },
   "./component/user": {
      "enable": true,
      "components": {
         "@ioa/http": {
            "enable": true
         },
      },
   },
}