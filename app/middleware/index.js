module.exports = app => {

  app.use(async function (ctx, next) {
    await next()
  })

  app.use(async function (ctx, next) {
    await next()
  })

}