'use strict';

const app = require('@app');

app.use('@ioa/config');
app.use('@ioa/koa');
app.use('@ioa/auth');
app.use('./@common');

app.loader({
   "model": {
      "level": 20,
   },
   "other": {
      level: 30
   },
   "test": {
      level: 30,
      action() {
         return 666;
      }
   },
})