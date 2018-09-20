'use strict';

module.exports = {
   config: {
      level: 1
   },
   model: {
      level: 2
   },
   middleware: {
      level: 3
   },
   controller: {
      level: 4,
      import(data) {

      }
   },
   typea: {
      level: 5,
      import(data) {

      }
   },
   other: {
      level: 6,
      import(data) {

      },
      complete(data) {

      }
   }
}