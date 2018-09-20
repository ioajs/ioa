'use strict';

module.exports = {
   success(name, timestamp, data = '') {

      let time = Date.now() - timestamp

      console.log(`\n\x1b[32m√ ${name} \x1b[39m(${time}ms) ${data}\x1b[30m`)

   },
   error(name, timestamp, error = '') {

      let time = Date.now() - timestamp

      console.log(`\n\x1b[31m× error » ${name} \x1b[39m(${time}ms) ${error}\x1b[30m`)

   }
}