'use strict';

let cwd = process.cwd()

module.exports = app => {

   /**
    * 
    * @param {String} type 请求类型，GET、POST、PUT、DELETE
    * @param {String} path 路由路径
    * @param {Array} middlewares 包含多个中间件的数组
    */
   function processPath(type, path, middlewares) {

      let [, ...pathArray] = path.split('/')

      // 对请求类型进行分组保存
      let iterative = app[type]

      //将path路径转换为对应的对象索引结构
      for (let name of pathArray) {

         let [one, ...cname] = name

         // 包含路由参数，提取并保存参数名
         if (one === ':') {
            iterative["*"] = { "<name>": cname.join('') }
            iterative = iterative["*"]
         } else {
            if (!iterative[name]) {
               iterative[name] = {}
            }
            iterative = iterative[name]
         }

      }

      iterative['<middlewares>'] = []

      // 添加中间件
      for (let item of middlewares) {
         if (item) {
            if (typeof item === 'function') {
               iterative['<middlewares>'].push(item)
            } else {
               throw new Error(`中间件${name}必须为函数`)
            }
         } else {
            throw new Error(`中间件${name}不存在`)
         }
      }

   }

   /**
    * 将middlewares中的控制器Path替换为对应的控制器中间件
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
         middlewares.push(controller)
      } else {
         throw new Error(`控制器${controllerPath}必须为Function`)
      }

   }

   /**
    * 将middlewares中的控制器Path替换为对应的控制器中间件
    */
   function processRest(path, middlewares) {

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

      if (typeof controller === 'object') {

         let REST = {
            'GET': "index",
            'POST': "create",
            'PUT': "update",
            'DELETE': "destroy",
         }

         for (let type in REST) {
            let name = REST[type]
            if (controller[name]) {
               processPath(type, path, [...middlewares, controller[name]])
            }
         }

      } else {

         throw new Error(`REST控制器${controllerPath}不存在`)

      }

   }


   // 路由预处理解析
   let router = {
      GET: {},
      POST: {},
      PUT: {},
      DELETE: {},
      get(path, ...middlewares) {
         processController(middlewares)
         processPath('GET', path, middlewares)
      },
      post(path, ...middlewares) {
         processController(middlewares)
         processPath('POST', path, middlewares)
      },
      put(path, ...middlewares) {
         processController(middlewares)
         processPath('PUT', path, middlewares)
      },
      delete(path, ...middlewares) {
         processController(middlewares)
         processPath('DELETE', path, middlewares)
      },
      resources(path, ...middlewares) {
         processRest(path, middlewares)
      }
   }

   Object.assign(app, router)

   // 加载用户路由配置文件，执行预处理
   require(cwd + '/app/router.js')(app)

   /**
    *  预生成路由索引数据结构示例
    *  *表示动态参数通配符，作为内部保留属性名称
    *  <name>表示动态参数名，使用<>号包裹，防止路命名冲突
    *  <middlewares>表示当前路由匹配的中间件队列，使用<>号包裹，防止路径中参数同名
    */
   // "avatar": {
   //    "*": {
   //       "<name>": "id",
   //       "test": {
   //          "*": {
   //             "<name>": "id",
   //             "*": {
   //                "<name>": "id",
   //                "<middlewares>": ["m1","m2"],
   //             },
   //          },
   //         "<middlewares>": ["m1","m2"],
   //       }
   //    },
   //    ":sid": {
   //       "*": {
   //          "<name>": "id",
   //          "<middlewares>": ["m1","m2","m3"],
   //       }
   //    }
   // }


   // 路由参数解析、分发中间件
   return async (ctx, next) => {

      ctx.parameter = {}

      // 参数解析
      let iterative = app[ctx.method]
      let [, ...pathArray] = ctx.path.split('/')
      for (let path of pathArray) {
         let item = iterative[path]
         if (item) {
            iterative = item
         }
         // 当参数不存在时，尝试用*号填充
         else if (iterative['*']) {
            iterative = iterative['*']
            ctx.parameter[iterative['<name>']] = path
         } else {
            ctx.body = '资源不存在'
            return
         }
      }

      if (iterative instanceof Object) {
         if (iterative["<middlewares>"]) {
            let index = 0
            // 替换koa的静态next，使用内置的递进器
            // 当在同一个中间件中触发多次next时会出现计数器混乱
            async function next() {
               index++
               await iterative["<middlewares>"][index](ctx, next)
            }
            await iterative["<middlewares>"][index](ctx, next)
         }
      }

   }

}