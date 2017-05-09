let Koa = require('koa');
let app = new Koa();
let DB = require('./db');
let path = String
let actionName = String
let controller = Function

// 表层
app.use(async function (ctx, next) {

  // URL解析
  path = ctx.url
  let urlArray = path.split('/')
  if (urlArray.length === 2) {
    // 控制器缺省
    if (urlArray[1] === '') {
      path = ''
    }
    // 指定控制器
    else {
      path = urlArray[1] + '/'
    }
    actionName = 'index'
  }
  // 大于2，表示URL中始终包含控制器
  else {
    // 缺省action
    if (urlArray[urlArray.length - 1] === '') {
      actionName = 'index'
    }
    // URL中包含action，从path中截取action
    else {
      actionName = urlArray.pop()
      path = urlArray.join('/') + '/'
    }
  }
  // 路由分发
  // 使用Node.js自身的模块寻址策略，自动匹配控制器路径
  // URL路径与实际模块路径保持一致，支持多级控制器
  try {
    controller = require(`./app/controller/${path}`)
    if (typeof controller !== 'function') {
      ctx.body = `控制器"${ctx.url}"返回值必须为函数类型`
      return
    }
  } catch (err) {
    ctx.body = `控制器"${ctx.url}"不存在`
    return
  }
  await next()
});


// 中间层
require('./app/middleware/')(app)


// 中心层
app.use(ctx => {
  // 添加模型选择器
  ctx.getModel = (name) => {
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
  // 执行controller和action
  let obj = controller(ctx)
  if (typeof obj === 'object') {
    let action = obj[actionName]
    if (typeof action === 'function') {
      action()
    } else {
      ctx.body = `"${actionName}"方法必须为函数`
    }
  } else {
    ctx.body = `控制器的返回值必须为对象`
  }
});

app.listen(3000);