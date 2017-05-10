let Koa = require('koa')
let app = new Koa()
let DB = require('./db') // 引入Sequelize模块
let controllerCache = {} // controller缓存在多个http请求中复用

// 为ctx添加模型选择器
app.context.getModel = (name) => {
  try {
    let model = require(`./app/model/${name}`)
    if (typeof model !== 'function') {
      ctx.body = `模型"${ctx.url}"返回值必须为函数类型`
    } else {
      return model(app)
    }
  } catch (err) {
    ctx.body = `模型"${name}"不存在`
  }
}

// 外层，http入口
// 路由分发，使用Node.js自身的模块寻址策略，自动匹配控制器路径
// URL路径与实际模块路径保持一致，支持多级控制器，控制器缓存
app.use(async function (ctx, next) {

  let controllerObj = {}
  let actionName = String
  let path = ctx.url  // URL参数解析
  let urlArray = path.split('/')
  // 0级或1级
  if (urlArray.length === 2) {
    actionName = 'index'
  }
  // 2级或2级以上，表示URL中始终包含控制器
  else {
    // 无action
    if (urlArray[urlArray.length - 1] === '') {
      actionName = 'index'
    }
    // 有action，从path中截取action
    else {
      actionName = urlArray.pop()
      path = urlArray.join('/')
    }
  }

  // 从缓存获取controllerObj
  if (controllerCache[path]) {
    controllerObj = controllerCache[path]
  }
  // 从模块获取并缓存controllerObj
  else {
    try {
      var controllerFun = require(`./app/controller${path}`)
    } catch (err) {
      ctx.body = `控制器"${ctx.url}"不存在`
      return
    }
    if (typeof controllerFun === 'function') {
      controllerObj = controllerFun(app)
      if (typeof controllerObj === 'object') {
        // 控制器对象写入缓存
        controllerCache[path] = controllerObj
      } else {
        ctx.body = `控制器函数return输出必须为对象`
        return
      }
    } else {
      ctx.body = `控制器"${ctx.url}"导出类型必须为函数`
      return
    }
  }
  // action赋值
  ctx.action = controllerObj[actionName]
  if (typeof ctx.action === 'function') {
    await next()
  } else {
    if (ctx.action) {
      ctx.body = `"${actionName}"方法必须为函数`
    } else {
      ctx.body = `"${actionName}"方法不存在`
    }
  }
})

// 中间层，中间件
require('./app/middleware/')(app)

// 中心层，执行action
app.use(ctx => {
  ctx.action(ctx)
})

app.listen(3000)