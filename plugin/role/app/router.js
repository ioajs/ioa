'use strict';

const app = require('ioa')

const { roles, token } = app.middleware

// 模糊匹配路由，泛解析，通用模型控制器
app.resources('/model/:name', roles, 'model')