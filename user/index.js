import { apps } from 'ioa';

const { user } = apps;

user.component('@ioa/config');
user.component('@ioa/koa');
user.component("./@common");

user.import({
  data: { level: 10 }
});
