'use strict';

const { version } = require('../package.json')

const debug = require('debug')('ioa')

const Controller = require('./controller.js')

// 环境变量
const NODE_ENV = process.env.NODE_ENV || 'production'

let app = {
   version,
   debug,
   NODE_ENV,
   Controller,
   root: process.cwd() // 命令行启动目录
}

module.exports = app