import api from '@ioa/api';
import { app } from 'ioa';

const { middleware } = app();

api.get('/common', middleware.token, async (ctx) => {
   ctx.body = 'common index'
});

api.get('/common/:id', middleware.token, async (ctx) => {
   ctx.body = 'common details'
});
