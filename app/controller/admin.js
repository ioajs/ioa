module.exports = app => {
  return {
    async index(ctx) {
      let tests = ctx.getModel('tests')
      let response = await tests.insert({
        'emp_id': '2',
        'nick': '小明',
        'department': '技术部'
      })
      ctx.body = response;
    },
    async get(ctx) {
      let response = await ctx.getModel('tests').get(61)
      ctx.body = response;
    }
  }
}