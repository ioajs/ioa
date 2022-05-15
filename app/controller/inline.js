import { main } from 'ioa';

const { router, middleware } = main;

const { token } = middleware;

router.get('/inline', token, async ctx => {

  ctx.body = 'router controller';

})
