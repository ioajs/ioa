let batchImport = require('batch-import')
let config = require('./config')

let app = batchImport({
   "config": {
      "path": "config/"
   },
   // "plugin": {
   //    "path": "plugin/",
   //    process(name, func) {
   //       if (func instanceof Function) {
   //          return func(this)
   //       } else {
   //          throw new Error(`${name}插件输出数据类型必须为函数`)
   //       }
   //    }
   // },
   "extend": {
      "path": "app/extend",
      process(name, func) {
         if (func instanceof Function) {
            // 对扩展进行扁平化处理，缩短访问路径
            let data = func(this)
            this[name] = data
            return data
         } else {
            throw new Error(`${name}扩展输出数据类型必须为函数`)
         }
      }
   },
   "models": {
      "path": "app/models/",
      process(name, func) {
         if (func instanceof Function) {
            return func(this)
         } else {
            throw new Error(`${name}模型输出数据类型必须为函数`)
         }
      }
   },
   "middleware": {
      "path": "app/middleware/",
      process(name, func) {
         if (func instanceof Function) {
            // middleware保持原样输出，不执行函数
            return func
         } else {
            throw new Error(`${name}中间件输出数据类型必须为函数`)
         }
      }
   },
   "controller": {
      "path": "app/controller/",
      process(name, func) {
         if (func instanceof Function) {
            return func(this)
         } else {
            throw new Error(`${name}中间件输出数据类型必须为函数`)
         }
      }
   },
})

// 合并配置项（未添加环境变量，暂时使用固定配置）
Object.assign(config, app.config.default)

Object.assign(config, app.config['localhost'])

app.config = config


// 全局配置中间件转换
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