import test from 'jtm';
import typea from 'typea';
import ioa from 'ioa';

test('ioa', t => {

  const schema = typea({
    argv: Object,
    version: String,
    NODE_ENV: String,
    apps: Function,
    components: {
      '@ioa/config': Object,
      '@ioa/koa': Object,
      '@common': Object,
    },
    applications: {
      main: {
        middlewareBefore: [Function],
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
        middlewareBefore: [Function],
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
        model: { compcerts: undefined },
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
        middlewareBefore: [Function],
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
    main: Object,
  });

  const { data, error } = schema.strictVerify(ioa);

  t.ok(data, error);

})