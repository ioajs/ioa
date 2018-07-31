const batchImport = require('batch-import')
const T = require('small-tools')
let app = require('./app.js')
let config = require('./config.js')

// 批量预加载模块
batchImport({
   "config": {
      "path": "config/"
   },
   "plugin": {
      "path": "app/plugin/",
      import(filename, func) {
         // if (func instanceof Function) {
         //    return func(this)
         // } else {
         //    throw new Error(`${filename}插件输出数据类型必须为函数`)
         // }
      }
   },
   "extend": {
      "path": "app/extend",
      import(filename, data) {
         // 如果导出为函数类型，则判定为依赖注入函数
         if (data instanceof Function) {
            data = data(this)
         }
         return data
      },
      complete(data) {
         // 对extend进行扁平化处理，缩短访问路径
         for (let name in data) {
            this[name] = data[name]
         }
         return data
      }
   },
   "model": {
      "path": "app/model/",
      import(filename, func) {
         if (func instanceof Function) {
            return func(this)
         } else {
            throw new Error(`${filename}模块导出必须为函数`)
         }
      }
   },
   "middleware": {
      "path": "app/middleware/",
      import(filename, func) {
         if (func instanceof Function) {
            // middleware保持原样输出，不执行函数
            return func
         } else {
            throw new Error(`${filename}模块导出必须为注入函数`)
         }
      }
   },
   "controller": {
      "path": "app/controller/",
      import(filename, func) {
         if (func instanceof Function) {
            if (func.prototype) {
               // 普通函数，不管是不是构造函数都可以使用new
               return new func(this)
            } else {
               // 箭头函数，没有prototype
               return func(this)
            }
         } else {
            throw new Error(`${filename}模块导出必须为注入函数`)
         }
      }
   }
}, app)


T.mixin(config, app.config.default)

let envConfig = app.config[app.NODE_ENV]

if (!envConfig) {
   throw new Error(`找不到与${app.NODE_ENV}环境变量对应的配置文件`)
}

T.mixin(config, envConfig)

app.config = config

// 自定义模块批量加载器
app.loader = function (options) {
   Object.assign(app, batchImport(options))
}

// 全局配置中间件转换
let middlewares = app.config.middlewares
if (middlewares) {
   for (let key in middlewares) {
      let name = middlewares[key]
      let middleware = app.middleware[name]
      if (middleware) {
         middlewares[key] = middleware
      } else {
         throw new Error(`没有找到${name}全局中间件`)
      }
   }
}

module.exports = app