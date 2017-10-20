'use strict';

module.exports = {
   start({ baseDir, port = 8800 }) {
      require('./start')(baseDir, port)
   }
}