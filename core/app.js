'use strict';

let app = {}

// Controller基类
app.Controller = class { }

// Service基类
app.Service = class { }

// 当前执行命令行所在的路径
app.cwd = process.cwd()

module.exports = app