'use strict';

const logger = require('loggercc')
const T = require('small-tools')
const Model = require('./extends/model')
const Controller = require('./extends/controller')
const { version } = require('../package.json')

module.exports = {
   version,
   port: 8800,
   cwd: process.cwd(),
   NODE_ENV: process.env.NODE_ENV || 'production',
   logger,
   Model,
   Controller,
   apps: {},
   /**
    * 设置默认app
    * @param {String} name 
    */
   default(name) {

      const port = T(this.apps[name]).get('config.port')
      if (port) {
         this.port = port
      }

   }
}