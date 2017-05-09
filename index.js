let Koa = require('koa');
let app = new Koa();
let DB = require('./db');
let path = String
let actionName = String
let controller = Function

// 外层
app.use(async function (ctx, next) {

  // URL解析
  path = ctx.url
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

  // 路由分发
  // 使用Node.js自身的模块寻址策略，自动匹配控制器路径
  // URL路径与实际模块路径保持一致，支持多级控制器
  try {
    controller = require(`./app/controller${path}`)
  } catch (err) {
    ctx.body = `控制器"${ctx.url}"不存在`
    return
  }
  if (typeof controller === 'function') {
    await next()
  } else {
    ctx.body = `控制器"${ctx.url}"返回值必须为函数类型`
  }
});


// 中间层
require('./app/middleware/')(app)


// 中心层
app.use(ctx => {
  // 执行controller和action
  let obj = controller(ctx)
  if (typeof obj === 'object') {
    let action = obj[actionName]
    if (typeof action === 'function') {
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
      action(ctx)
    } else {
      ctx.body = `"${actionName}"方法必须为函数`
    }
  } else {
    ctx.body = `控制器的返回值必须为对象`
  }
});

app.listen(3000);