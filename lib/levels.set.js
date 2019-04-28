'use strict';

const { apps } = require('..');

module.exports = function (levels) {
   
   for (const name in apps) {
      
      const app = apps[name];

      Object.assign(app.levels, levels);

   }

}