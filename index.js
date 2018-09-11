'use strict';

// app跨域容器
module.exports = require('./core/app')

// 加载主框架
require('./core/main')

// 加载插件框架
require('./core/plugin')

// 合并config
require('./core/config')

// 加载路由
require('./core/router')

// 启用http
require('./core/http')