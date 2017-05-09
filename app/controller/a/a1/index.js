module.exports = ctx => {
  return {
    index() {
      ctx.body = 'Hello goods111';
    },
    test() {
      ctx.body = 'Hello goods test';
    }
  }
}