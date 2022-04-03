import { app } from 'ioa';

const user = app();

user.component('@ioa/config');
user.component('@ioa/koa');
user.component("./@common");

user.import({
  "data": {
    "level": 10,
  }
});
