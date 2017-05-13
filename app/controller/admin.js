module.exports = app => {
  return {
    async index(ctx) {
      let response = await ctx.collection('compcerts').find().limit(10)
      if (response) {
        ctx.body = response
      } else {
        ctx.body = { error: '获取失败' }
      }
    },
    async get(ctx) {
      let response = await ctx.collection('compcerts').find().limit(10)
      ctx.body = response;
    }
  }
}