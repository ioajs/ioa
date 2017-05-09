module.exports = ctx => {
  return {
    async index() {
      let response = await ctx.getModel('tests').insert({
        'emp_id': '2',
        'nick': '小明',
        'department': '技术部'
      })
      ctx.body = response;
    },
    test() {
      ctx.body = 'Hello goods test';
    }
  }
}