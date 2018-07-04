'use strict';

let app = {}

// Controller基类
app.Controller = class { }

// Service基类
app.Service = class { }

// 应用根目录
app.cwd = process.cwd()

module.exports = app