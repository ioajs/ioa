import ioa from 'ioa';

const { app } = ioa;

app.use('@ioa/config');
app.use('@ioa/koa');
app.use('./@common');

app.loader({
   "model": {
      "level": 20,
   },
   "extend": {
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
});
