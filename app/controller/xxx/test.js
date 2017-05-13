module.exports = app => {
  return {
    async index(ctx) {
      let response = await ctx.collection('compcerts').insertMany([
        {
          item: "journal",
          qty: 25,
          size: { h: 14, w: 21, uom: "cm" },
          status: "A"
        },
        {
          item: "notebook",
          qty: 50,
          size: { h: 8.5, w: 11, uom: "in" },
          status: "A"
        }
      ])
      if (response) {
        ctx.body = response
      } else {
        ctx.body = { error: '获取失败' }
      }
    },
    async get(ctx) {
      let response = await ctx.collection('compcerts').get(61)
      ctx.body = response;
    }
  }
}