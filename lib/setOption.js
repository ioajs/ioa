'use strict';

const { apps } = require('..');

module.exports = function (options) {
   
   for (const name in apps) {
      const app = apps[name];
      Object.assign(app.options, options);
   }

}