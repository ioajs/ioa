import api from '@ioa/api';
import { main } from 'ioa';

const { middleware } = main;

const { token } = middleware;

api.get('/inline', token, async ctx => {

  ctx.body = 'router controller';

})
