'use strict';

// app跨域容器，由于根模块内部存在相互引用，需要提前导出依赖
module.exports = require('./core/app')

// 添加路由解析器
require('./core/router')

// 加载主框架
require('./core/main')

// 加载插件框架
require('./core/plugin')

// 合并config
require('./core/config')

// 启用http
require('./core/http')