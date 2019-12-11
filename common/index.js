'use strict';

const app = require('@app');

app.on('@ioa/koa');
app.on('@ioa/auth');

app.loader({
   "roles.js": {
      'level': 22
   },
})