import test from 'ava';
import check from 'check-data';
import app from '..';

test('检查app对象', t => {
   let { data, error } = check(app, {
      Controller: Function,
      Service: Function,
      cwd: String,
      config: {
         middlewares: [Function],
         port: Number,
      },
      plugin: { demo: { app: Object } },
      extend: {
         application: Number,
         context: Object,
         db: Object,
         emulates: Object
      },
      application: Number,
      context: Object,
      db: Object,
      emulates: Object,
      models: { compcerts: Object },
      middleware: {
         cors: Function,
         test: Function,
         token: Function
      },
      controller: {
         admin: {
            index: Object,
            news: Object,
            rest: Object,
            test: Object
         },
         loader: Function,
         listen: Function,
         get: Function,
         post: Function,
         put: Function,
         delete: Function,
         resources: Function,
         koa: Object
      }
   })
   t.truthy(data, error);
});