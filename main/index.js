'use strict';

const app = require('@app');

app.on('@ioa/config');
app.on('@ioa/koa');
app.on('@ioa/auth');
app.on('./@common/');

app.loader({
   "model": {
      "level": 20,
   },
   "other": {
      level: 30
   },
})