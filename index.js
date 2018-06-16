'use strict';

// let app = require('newseed')

let newseed = require('./framework/')

// http服务不是必须的，不需要时可以关闭
newseed.listen({ port: 8800 })