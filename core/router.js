'use strict';

const path = require('path')
const app = require('..')

const Resources = {
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
app.container = {}

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
   let iterative = app.container

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
    * @param {String} path 
    * @param {...Function} middlewares 
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

// 加载主路由设置文件
try {
   require(path.join(app.root, 'app/router.js'))
} catch (error) {

}

// 加载插件路由设置文件
try {
   for (let name in app.plugin) {
      require(path.join(app.root, 'plugin', name, 'app', 'router'))
   }
} catch (error) {

}