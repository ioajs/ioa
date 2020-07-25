'use strict';

const test = require('jmr');
const typea = require('typea');
const ioa = require('ioa');

test('ioa', t => {

  const schema = typea({
    argv: Object,
    version: String,
    cwd: String,
    NODE_ENV: String,
    app: Function,
    main: Object,
    apps: {
      main: {
        components: {
          '@ioa/config': Object,
          '@ioa/koa': Object,
          '@ioa/auth': Object,
          '@common': Object,
        },
        beforeMiddleware: [Function],
        router: {
          get: Function,
          post: Function,
          put: Function,
          delete: Function,
          resources: Function
        },
        config: {
          "mixin": {
            a: 666
          }
        },
        model: {
          document: Object
        },
        middleware: {
          cors: Function,
          token: Function
        },
        controller: {
          home: {
            index: Function,
            sms: Function,
            login: Function,
          },
          index: {
            test: Function,
          },
          news: {
            index: Function,
            details: Function,
          },
          rest: {
            index: Function,
            details: Function,
            create: Function,
            update: Function,
            destroy: Function
          },
          test: {
            index: Function,
            details: Function,
            create: Function,
            update: Function,
            destroy: Function
          }
        },
      },
      admin: {
        components: Object,
        beforeMiddleware: [Function],
        router: {
          get: Function,
          post: Function,
          put: Function,
          delete: Function,
          resources: Function
        },
        config: {
          base: String
        },
        model: { compcerts: Object },
        middleware: {
          verify: Function,
          token: Function,
        },
        controller: {
          home: {
            index: Function,
            details: Function,
            add: Function,
            update: Function,
            delete: Function
          }
        },
      },
      user: {
        components: Object,
        beforeMiddleware: [Function],
        router: {
          get: Function,
          post: Function,
          put: Function,
          delete: Function,
          resources: Function
        },
        config: {},
        middleware: {
          test: Function,
          intercept: Function
        },
        controller: {
          home: {
            home: Function,
          }
        }
      },
    },
    components: {
      "@ioa/koa": Object,
      "@ioa/auth": Object,
      "@common": Object,
    },
  })

  const { data, error } = schema.strictVerify(ioa);


  t.ok(data, error);

})