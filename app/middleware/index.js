module.exports = app => {

  // 中间层
  app.use(async function (ctx, next) {
    await next()
  })

  app.use(async function (ctx, next) {
    await next()
  })

}