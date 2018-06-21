let batchImport = require('batch-import')
let config = require('./config')

let app = batchImport({
   "config": {
      "path": "config/"
   },
   "plugin": {
      "path": "app/plugin/",
      process(func, app) {
         if (typeof func === 'function') {
            return { data: func(app) }
         } else {
            return { error: "process输出数据类型必须为函数" }
         }
      }
   },
   "extend": {
      "path": "app/extend",
      process(func, app) {
         if (typeof func === 'function') {
            return { data: func(app) }
         } else {
            return { error: "extend输出数据类型必须为函数" }
         }
      }
   },
   "models": {
      "path": "app/models/",
      process(func, app) {
         if (typeof func === 'function') {
            return { data: func(app) }
         } else {
            return { error: `模型输出数据类型必须为Object` }
         }
      },
   },
   "middleware": {
      "path": "app/middleware/",
      process(func, app) {
         if (typeof func === 'function') {
            return { data: func }
         } else {
            return { error: `middleware输出数据类型必须为Function` }
         }
      },
   },
   "controller": {
      "path": "app/controller/",
      process(func, app) {
         if (typeof func === 'function') {
            return { data: func(app) }
         } else {
            return { error: `控制器输出数据类型必须为Object` }
         }
      },
   },
})

// 合并配置项
Object.assign(config, app.config.default)

// 未添加环境变量，暂时使用固定localhost配置
Object.assign(config, app.config['localhost'])

app.config = config

// 全局中间件转换
let middlewares = app.config.middlewares
if (middlewares) {
   for (let key in middlewares) {
      let name = middlewares[key]
      let middleware = app.middleware[name]
      if (middleware) {
         middlewares[key] = middleware
      } else {
         throw new Error('没有找到${name}全局中间件')
      }
   }
}

// 自定义模块批量加载器
app.loader = function (options) {
   Object.assign(app, batchImport(options))
}

module.exports = app