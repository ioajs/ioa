module.exports = ctx => {
  return {
    index() {
      ctx.body = 'Hello goods';
    },
    test() {
      ctx.body = 'Hello goods test';
    },
    color() {
      ctx.body = 'Hello goods color';
    }
  }
}