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

app.loader = function (options) {
   Object.assign(app, batchImport(options))
}

module.exports = app