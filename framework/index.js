'use strict';

module.exports = {
  start(options) {
    require('./start')(options.baseDir, options.port || 3000)
  }
}