import ioa from 'ioa';

const app = ioa.app();

app.component('@ioa/config');
app.component('@ioa/koa');

app.import({
  "data": {
    "level": 10,
  }
})
