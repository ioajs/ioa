'use strict';

module.exports = function (config) {
   
   for (const item of this.dependApps) {
      Object.assign(item.options, config);
   }

}