'use strict';

module.exports = {
   '@ioa/http': {
      "enable": true,
      options(ioa, options) {
         Object.assign(ioa.options, options);
      }
   },
   "./component/admin": {
      "enable": true,
   },
   "./component/other": {
      "enable": true
   },
   "./component/user": {
      "enable": true
   },
}