import { main } from 'ioa';
import api from '@ioa/api';

const { middleware } = main;

api.get('/news', (ctx) => {
   ctx.body = 'news index';
})

api.get('/news/:id/details/:kk', middleware.token, (ctx) => {
   ctx.body = {
      params: ctx.params,
      body: 'news details'
   };
})
