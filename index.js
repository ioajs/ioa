let Koa = require('koa')
let app = new Koa()
let DB = require('./app/DB')
let middlewareObject = require('./app/middleware/config')
let controllerCache = {} // controller缓存在多个http请求中复用
let modelCache = {} // model缓存在多个http请求中复用

// 外层，http入口
// 路由分发，使用Node.js自身的模块寻址策略，自动匹配控制器路径
// URL路径与实际模块路径保持一致，支持多级控制器，控制器缓存
app.use(async (ctx, next) => {

  let actionName = String
  let path = ctx.url  // URL参数解析
  let urlArray = path.split('/')

  // 0级或1级
  if (urlArray.length === 2) {
    actionName = 'index'
  }
  // 2级或2级以上
  else {
    // 截取action
    actionName = urlArray.pop()
    // 缺省action指向index
    if (actionName === '') {
      actionName = 'index'
    }
    path = urlArray.join('/')
  }

  let errorInfo = {
    code: 404,
    error: '资源不存在'
  }
  let controllerObj = {}
  // 从缓存获取controllerObj
  if (controllerCache[path]) {
    controllerObj = controllerCache[path]
  }
  // 从模块获取并缓存controllerObj
  else {
    try {
      var controllerFun = require(`./app/controller${path}`)
    } catch (err) {
      ctx.body = errorInfo
      console.error(`"${path}"控制器不存在或语法错误`)
      return
    }
    if (typeof controllerFun === 'function') {
      controllerObj = controllerFun(app)
      if (typeof controllerObj === 'object') {
        // 控制器对象写入缓存
        controllerCache[path] = controllerObj
      } else {
        ctx.body = errorInfo
        console.error(`"${path}"控制器函数return输出必须为对象`)
        return
      }
    } else {
      ctx.body = errorInfo
      console.error(`"${path}"控制器导出类型必须为函数`)
      return
    }
  }

  // action赋值
  ctx.action = controllerObj[actionName]
  if (typeof ctx.action === 'function') {
    await next()
  } else {
    if (ctx.action) {
      ctx.body = errorInfo
      console.error(`"${actionName}"方法必须为函数`)
    } else {
      ctx.body = errorInfo
      console.error(`"${actionName}"方法不存在`)
    }
  }
})

// 中间层，挂载中间件
if (typeof middlewareObject === 'object') {
  for (let item of middlewareObject) {
    try {
      item.middleware = require(`./app/middleware/${item.name}`)
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

// 中心层，执行action
app.use(async ctx => {
  await ctx.action(ctx)
})

// 为ctx添加模型选择器
app.context.collection = (name) => {
  if (modelCache[name]) {
    return modelCache[name]
  } else {
    try {
      var model = require(`./app/models/${name}`)
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

// 启动http服务
app.listen(3000)