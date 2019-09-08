'use strict';

const app = require('@app');

app.on('@ioa/koa');
app.on('@ioa/model');
app.on('@ioa/auth');
app.on('./common');

module.exports = {
   other: {
      level: 16
   }
}