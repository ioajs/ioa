'use strict';

let path = require('path')
let app = require('./app.js')

let routerPath = path.join(app.root, '/app/router.js')

let Resources = {
   "index": {
      "type": 'GET',
      "parameter": ""
   },
   "details": {
      "type": 'GET',
      "parameter": "/:id"
   },
   "create": {
      "type": 'POST',
      "parameter": ""
   },
   "update": {
      "type": 'PUT',
      "parameter": "/:id"
   },
   "destroy": {
      "type": 'DELETE',
      "parameter": "/:id"
   }
}

// 路由预处理解析容器
let container = {}

/**
 * 
 * @param {String} type 请求类型，GET、POST、PUT、DELETE
 * @param {String} path 路由路径
 * @param {Array} middlewares 包含多个中间件的数组
 * @param {Function} controller 控制器
 */
function processPath(type, path, middlewares, controller) {

   // 中间件类型验证
   for (let item of middlewares) {
      if (item) {
         if (!(item instanceof Function)) {
            throw new Error(`中间件${name}必须为函数类型`)
         }
      } else {
         throw new Error(`中间件${name}不存在`)
      }
   }

   // 控制器类型验证
   if (!(controller instanceof Function)) {
      throw new Error(`控制器${path}不存在`)
   }

   let [, ...pathArray] = path.split('/')

   // 对请求类型进行分组保存
   let iterative = container

   //将path路径转换为对应的对象索引结构
   for (let name of pathArray) {

      let [one, ...cname] = name

      // 路由包含动态参数，提取并保存参数名
      if (one === ':') {

         if (!iterative["<*>"]) {
            iterative["<*>"] = {}
         }
         iterative = iterative["<*>"]
         iterative["<name>"] = cname.join('')

      } else {

         if (!iterative[name]) {
            iterative[name] = {}
         }
         iterative = iterative[name]

      }

   }

   if (!iterative['<middlewares>']) {
      iterative['<middlewares>'] = {}
   }

   iterative['<middlewares>'][type] = [...app.config.middlewares, ...middlewares, controller]

}

/**
 * 从middlewares中提取控制器Path，根据Path提取控制器
 */
function processController(middlewares) {

   let controllerPath = middlewares.pop()
   let controllerPathArray = controllerPath.split('.')

   // 迭代提取controller
   let controller = app.controller
   for (let itemPath of controllerPathArray) {
      let item = controller[itemPath]
      if (item) {
         controller = item
      } else {
         throw new Error(`控制器${controllerPath}不存在`)
      }
   }

   if (typeof controller === 'function') {
      return controller
   } else {
      throw new Error(`控制器${controllerPath}不存在`)
   }

}

// 路由预处理解析，按请求类型进行分组
let router = {
   get(path, ...middlewares) {
      let controller = processController(middlewares)
      processPath('GET', path, middlewares, controller)
   },
   post(path, ...middlewares) {
      let controller = processController(middlewares)
      processPath('POST', path, middlewares, controller)
   },
   put(path, ...middlewares) {
      let controller = processController(middlewares)
      processPath('PUT', path, middlewares, controller)
   },
   delete(path, ...middlewares) {
      let controller = processController(middlewares)
      processPath('DELETE', path, middlewares, controller)
   },
   /**
    * 生成rest api
    * @param {*} path 
    * @param {*} middlewares 
    */
   resources(path, ...middlewares) {

      let controllerPath = middlewares.pop()
      let controllerPathArray = controllerPath.split('.')

      // 迭代提取controllers
      let controllers = app.controller
      for (let itemPath of controllerPathArray) {

         let item = controllers[itemPath]
         if (item) {
            controllers = item
         } else {
            throw new Error(`RESTful控制器${controllerPath}不存在`)
         }

      }

      if (typeof controllers === 'object') {

         for (let name in Resources) {
            let controller = controllers[name]
            if (controller instanceof Function) {
               let { type, parameter } = Resources[name]
               processPath(type, path + parameter, middlewares, controller)
            }
         }

      } else {

         throw new Error(`REST控制器${controllerPath}不存在`)

      }

   }
}

// 将router方法混合到app中，方便快速访问
Object.assign(app, router)

// 加载用户路由配置文件，生成路由映射对象结构
try {
   let router = require(routerPath)
   if (router instanceof Function) {
      router(app)
   }
} catch (error) {
   throw error
}


// 路由参数解析、路由分发中间件
module.exports = async (ctx) => {

   ctx.parameter = {}

   let iterative = container

   // 通过path路径查找中间件
   let [, ...pathArray] = ctx.path.split('/')
   for (let path of pathArray) {
      let item = iterative[path]
      if (item) {
         iterative = item
      }
      // 当参数不存在时，尝试用*号填充
      else if (iterative['<*>']) {
         iterative = iterative['<*>']
         ctx.parameter[iterative['<name>']] = path
      } else {
         ctx.body = '资源不存在'
         return
      }
   }

   if (iterative instanceof Object) {

      iterative = iterative["<middlewares>"]

      if (iterative) {

         let middlewares = iterative[ctx.method]

         // 未匹配到中间件
         if (!middlewares) {
            if (ctx.method === 'OPTIONS') {
               ctx.status = 204
               let method = ctx.request.header["access-control-request-method"]
               middlewares = iterative[method]
               if (middlewares) {
                  // 创建新副本，并从副本中删除controller，避免无意义的执行controller
                  middlewares = [...middlewares]
                  middlewares.pop()
               } else {
                  return
               }
            } else {
               ctx.status = 500
               return
            }
         }

         // 使用内置的递进器替换掉koa的next()，当在同一个中间件中触发多次next时会出现计数器混乱
         let index = 0
         async function next() {
            index++
            if (middlewares[index]) {
               await middlewares[index](ctx, next)
            }
         }

         await middlewares[index](ctx, next)

      }

   }

}