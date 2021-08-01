import ioa from 'ioa';

const { router, middleware } = ioa.app();

const { token } = middleware;

router.get('/inline', token, async ctx => {

  ctx.body = 'router controller';

})
