module.exports = app => {
  return {
    index(ctx) {
      ctx.body = 'Hello goods';
    },
    test(ctx) {
      ctx.body = 'Hello goods test';
    },
    color(ctx) {
      ctx.body = 'Hello goods color';
    }
  }
}