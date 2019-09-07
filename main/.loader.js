'use strict';

const app = require('@app');

app.on('@ioa/koa');
app.on('@ioa/model');
app.on('@ioa/auth');
app.on('./common');

const { loads } = app;

module.exports = {
   ...loads,
   other: {
      level: 16
   }
}