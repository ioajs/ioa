'use strict';

let cwd = process.cwd()

module.exports = app => {

   let { middleware, controller } = app

   /**
    * 
    * @param {String} type 请求类型，GET、POST、PUT、DELETE
    * @param {String} path 路由路径
    * @param {Array} middleware 包含多个中间件的数组
    */
   function process(type, path, middleware) {

      let [, ...pathArray] = path.split('/')

      let route = app[type]
      for (let item of pathArray) {

         //构建树状路由导航模型
         if (!route[item]) {
            let [one, ...name] = item
            // 路由参数，提取并保存参数名
            if (one === ':') {
               route["*"] = {
                  "*name": name.join('')
               }
               route = route["*"]
            } else {
               route[item] = {}
               route = route[item]
            }
         }

      }

      /**
       *  路由模型示例
       *  *表示动态参数
       *  *name表示动态参数名，
       *  *middleware表示当前路由匹配的中间件
       */
      // "avatar": {
      //    "*": {
      //       "*name": "id",
      //       "test": {
      //          "*": {
      //             "*name": "id",
      //             "*": {
      //                "*name": "id",
      //                "*middleware": ["m1","m2"],
      //             }
      //          }
      //       }
      //    },
      //    ":sid": {
      //       "*": {
      //          "*name": "id",
      //          "*middleware": ["m1","m2","m3"],
      //       }
      //    }
      // }

      // route.path[item].
      // let [, parameter] = item.split(':')
      // if (parameter) {
      // route.parameter.push(parameter)
      // }

      route['*middleware'] = []

      let controllerPath = middleware.pop().split('.')

      // 添加中间件
      for (let item of middleware) {
         if (item) {
            if (typeof item === 'function') {
               route['*middleware'].push(item)
            } else {
               throw `中间件${name}必须为函数`
            }
         } else {
            throw `中间件${name}不存在`
         }
      }

      // 控制器作为最后一个特殊中间件
      let progressive = controller
      for (let itemPath of controllerPath) {
         let item = progressive[itemPath]
         if (item) {
            progressive = item
         } else {
            throw `控制器${path}不存在`
         }
      }

      if (typeof progressive === 'function') {
         route['*middleware'].push(progressive)
      } else {
         throw `控制器${path}必须为Function`
      }

   }

   // 路由预处理解析
   let router = {
      GET: {},
      POST: {},
      PUT: {},
      DELELT: {},
      get(path, ...middleware) {
         process('GET', path, middleware)
      },
      post(path, ...middleware) {
         process('POST', path, middleware)
      },
      put(path, ...middleware) {
         process('PUT', path, middleware)
      },
      delete(path, ...middleware) {
         process('DELETE', path, middleware)
      },
      resources(path, ...middleware) {

      }
   }

   Object.assign(app, router)

   // 用户路由配置文件
   require(cwd + '/app/router.js')(app)

   // 路由中间件
   return async (ctx, next) => {

      ctx.parameter = []

      let [, ...pathArray] = ctx.path.split('/')

      let progressive = app[ctx.method]
      for (let path of pathArray) {
         let item = progressive[path]
         if (item) {
            progressive = item
         } else if (progressive['*']) {
            progressive = progressive['*']
         } else {
            ctx.body = '资源不存在'
            return
         }
      }

      if (typeof progressive === 'object') {
         if (progressive["*middleware"]) {
            let index = 0
            async function next() {
               index++
               await progressive["*middleware"][index](ctx, next)
            }
            await progressive["*middleware"][index](ctx, next)
         }
      }

      // console.log(progressive, pathArray)

   }

}