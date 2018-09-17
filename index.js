'use strict';

// app跨域容器，由于根模块内部存在相互引用，需要提前导出依赖
module.exports = require('./lib/app')

// 加载前置依赖
require('./lib/before')

// 加载主框架
require('./lib/main')

// 加载组件框架
require('./lib/plugin')

// 启动http
require('./lib/http')