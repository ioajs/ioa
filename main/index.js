'use strict';

const app = require('@app');

app.on('@ioa/config');
app.on('@ioa/koa');
app.on('@ioa/auth');
app.on('./common');

module.exports = {
   'other': {
      level: 30
   },
   "model": {
      "level": 20,
   },
}