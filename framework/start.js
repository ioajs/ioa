let fs = require('fs')
let Koa = require('koa')
let app = new Koa()
let controllerCache = {} // controller缓存
let modelCache = {} // model缓存
let errorInfo = { code: 404, error: '资源不存在' }

module.exports = (baseDir, port) => {
  let DB = require(baseDir + '/app/DB')
  let middlewareObject = require(baseDir + '/app/middleware/config')

  // 递归加载控制器
  function recursion(path) {
    path = path || '/'
    try {
      var files = fs.readdirSync(baseDir + '/app/controller' + path)
    } catch (err) {
      console.error(`${path}获取失败`)
      return true
    }
    if (files) {
      files.forEach((filename) => {
        let key = filename.indexOf('.js')
        // 文件
        if (key > -1) {
          filename = filename.slice(0, key)
          let controller = path + filename
          try {
            var controllerFun = require(baseDir + '/app/controller' + controller)
          } catch (err) {
            console.error(`"${controller}"控制器不存在或语法错误`)
            return true
          }
          // 检查控制器导出类型是否为函数
          if (typeof controllerFun === 'function') {
            controllerObj = controllerFun(app)
            // 检查控制器函数返回值是否为对象
            if (typeof controllerObj === 'object') {
              // 控制器对象写入缓存
              controllerCache[controller] = controllerObj
            } else {
              console.error(`"${controller}"控制器函数return输出必须为对象`)
              return true
            }
          } else {
            console.error(`"${controller}"控制器导出类型必须为函数`)
            return true
          }
        }
        // 目录
        else {
          recursion(path + filename + '/')
        }
      })
    }
  }

  // http入口
  // 路由分发，使用Node.js自身的模块寻址策略，自动匹配控制器路径
  // URL路径与实际模块路径保持一致，支持多级控制器，控制器缓存
  app.use(async (ctx, next) => {

    // 用于在ctx中访问数据参数对象
    ctx.parameter = {}

    ////////// url参数解析  //////////

    let url = ctx.url.trim()
    let splitKey = url.indexOf('?')// 参数分割

    // 不含动态参数
    if (splitKey === -1) {
      var routeArray = url.split('/')
    }
    // 包含动态参数
    else {
      // 路由参数解析
      var routeArray = url.slice(0, splitKey).split('/')
      // 动态参数解析，解析后直接导入ctx，路由中用不到
      let parameterArray = url.slice(splitKey + 1).split('&')
      for (let item of parameterArray) {
        if (item !== '') {
          let itemArray = item.split('=')
          if (itemArray.length === 2) {
            ctx.parameter[itemArray[0]] = itemArray[1]
          }
        }
      }
    }

    let cPath = String
    let actionName = String
    // 0级或1级
    if (routeArray.length === 2) {
      if (routeArray[1] === '') {
        cPath = '/index'
      } else {
        cPath = '/' + routeArray[1]
      }
      actionName = 'index'
    }
    // 2级或2级以上
    else {
      // 截取action
      actionName = routeArray.pop()
      // 缺省action指向index
      if (actionName === '') {
        actionName = 'index'
      }
      cPath = routeArray.join('/')
    }

    ////////// 从缓存获取controllerObj   //////////

    let controllerObj = {}
    if (controllerCache[cPath]) {
      controllerObj = controllerCache[cPath]
    } else {
      ctx.body = errorInfo
      console.error(`"${cPath}"控制器不存在`)
    }

    //////////  获取并检查action是否合法  //////////

    ctx.action = controllerObj[actionName]
    if (typeof ctx.action === 'function') {
      await next()
    } else if (ctx.action) {
      ctx.body = errorInfo
      console.error(`"${actionName}"方法必须为函数`)
    } else {
      ctx.body = errorInfo
      console.error(`"${actionName}"方法不存在`)
    }
  })

  //////////// 用户中间件 ////////////

  if (typeof middlewareObject === 'object') {
    for (let item of middlewareObject) {
      try {
        item.middleware = require(`${baseDir}/app/middleware/${item.name}`)
      } catch (err) {
        console.error(`${item.name}中间件模块不存在`)
      }
      if (typeof item.middleware === 'function') {
        app.use(async (ctx, next) => {
          await item.middleware(ctx, next, item.options)
        })
      } else {
        console.error(`${item.name}中间件导出类型必须为函数`)
      }
    }
  }

  //////////// 中心层，执行action ////////////

  app.use(async ctx => {
    await ctx.action(ctx)
  })

  ////////// 为ctx添加模型选择器 //////////////

  app.context.collection = (name) => {
    if (modelCache[name]) {
      return modelCache[name]
    } else {
      try {
        var model = require(`${baseDir}/app/models/${name}`)
      } catch (err) {
        console.error(`模型"${name}"不存在`)
        return
      }
      if (typeof model === 'function') {
        let modelFun = model(app)
        if (typeof modelFun === 'function') {
          modelCache[name] = modelFun
          return modelFun
        } else {
          console.error(`模型函数"${name}"返回值必须为对象`)
          return
        }
      } else {
        console.error(`模型"${name}"导出类型必须为函数`)
        return
      }
    }
  }

  if (recursion()) {
    console.log('控制器错误，http服务未启动')
  } else {
    app.listen(port)
  }

}