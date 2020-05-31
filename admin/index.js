'use strict';

const app = require('@app');

app.use('@ioa/config');
app.use('@ioa/koa');
app.use('@ioa/auth');

app.loader({
   "model": {
      "level": 20,
   },
})
