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
    async item(ctx) {
      let response = await ctx.collection('compcerts').findOne({ 'CompanyManList.Phone': '0755-28909233' });
      if (response) {
        ctx.body = response
      } else {
        ctx.body = { error: '获取失败' }
      }
    },
    async edit(ctx) {
      let response = await ctx.collection('compcerts').findOne({ 'CompanyManList.Phone': '0755-28909233' });
      if (response) {
        ctx.body = response
      } else {
        ctx.body = { error: '获取失败' }
      }
    },
    async add(ctx) {
      // console.log(ctx.parameter)
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
    }
  }
}