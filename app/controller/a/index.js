module.exports = ctx => {
  return {
    index() {
      ctx.body = 'Hello goods a';
    },
    test() {
      ctx.body = 'Hello goods test';
    }
  }
}