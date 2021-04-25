import test from 'jtm';
import typea from 'typea';
import ioa from 'ioa';

test('ioa', t => {

  const schema = typea({
    argv: Object,
    version: String,
    cwd: String,
    NODE_ENV: String,
    loadApp: Function,
    main: Object,
    apps: {
      main: {
        components: {
          '@ioa/config': Object,
          '@ioa/koa': Object,
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
        test: 666
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
      "@common": Object,
    },
  });

  const { data, error } = schema.strictVerify(ioa);

  t.ok(data, error);

})