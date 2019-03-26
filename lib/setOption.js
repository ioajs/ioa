'use strict';

module.exports = function (options) {

   const { apps } = this;
   for (const name in apps) {
      const app = apps[name];
      Object.assign(app.options, options);
   }

}