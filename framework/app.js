let batchImport = require('batch-import')

let app = batchImport({
   "config": {
      "path": "config/",
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
      process(data, app) {
         if (typeof data === 'function') {
            data = data(app)
         }
         if (typeof data === 'object') {
            return { data }
         } else {
            return { error: `模型输出数据类型必须为Object` }
         }
      },
   },
   "middleware": {
      "path": "app/middleware/",
      process(data) {
         if (typeof data === 'function') {
            return { data }
         } else {
            return { error: `中间件输出数据类型必须为Function` }
         }
      },
   },
   "controller": {
      "path": "app/controller/",
      process(data, app) {
         if (typeof data === 'function') {
            data = data(app)
         }
         if (typeof data === 'object') {
            return { data }
         } else {
            return { error: `控制器输出数据类型必须为Object` }
         }
      },
   },
})

app.loader = function (options) {
   Object.assign(app, batchImport(options))
}

module.exports = app