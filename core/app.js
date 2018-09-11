'use strict';

const batchImport = require('batch-import')
const { version } = require('../package.json')

// 由于根模块内部存在相互引用，需要提前导出必要的依赖
const app = {
   version,
   root: process.cwd(),
   NODE_ENV: process.env.NODE_ENV || 'production',
   loader(options) {
      batchImport(options, app)
   }
}

module.exports = app