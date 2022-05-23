import api from '@ioa/api';
import { main } from 'ioa';

const { token } = main.middleware;

api.post('/login', token, async ctx => {
  const { body } = ctx.request
  ctx.body = {
    type: 'login',
    body
  };
})