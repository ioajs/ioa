'use strict';

const logger = require('loggercc')
const { version } = require('../package.json')

// 在载入主框架前先加载必要的依赖
const Model = require('./extends/model')
const Controller = require('./extends/controller')

module.exports = {
   version,
   root: process.cwd(),
   NODE_ENV: process.env.NODE_ENV || 'production',
   logger,
   Model,
   Controller,
   components: {},
}