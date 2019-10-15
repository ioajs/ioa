'use strict';

const app = require('@app');

app.on('@ioa/koa');
app.on('@ioa/auth');

const { loads } = app;

module.exports = {
   ...loads,
   "roles.js": {
      'level': 22
   },
};