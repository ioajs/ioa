import test from 'jtm';
import ioa from 'ioa';
import types, { $index, string, number, func, object } from 'typea';

test('ioa', t => {

  const $components = {}

  const common = {
    $name: string,
    $base: string,
    $entry: string,
    $components,
    $import: {
      ...object({
        level: number,
        action: func({ optional: true }),
        module: func({ optional: true }),
        directory: func({ optional: true }),
        before: func({ optional: true }),
        after: func({ optional: true })
      })
    },
    import() { }
  };

  const component = {
    ...common,
    $release: {},
    $export: {},
    export() { }
  };

  $components[$index] = component;

  const app = {
    middlewareBefore: [...Function],
    router: {
      get() { },
      post() { },
      put() { },
      delete() { },
      resources() { }
    },
  }

  const main = {
    ...common,
    ...app,
    config: {
      "@ioa/koa": {
        "port": number
      },
      mixin: { a: 666 }
    },
    middleware: {
      token() { }
    },
    model: {
      document: object,
      ...object
    },
    controller: {
      home: {
        index(a = String, b = Number) { return arguments },
        sms() { },
        login() { },
      },
      index: {
        test() { },
      },
      news: {
        index() { },
        details() { },
      },
      rest: {
        index() { },
        details() { },
        create() { },
        update() { },
        destroy() { }
      },
      test: {
        index() { },
        details() { },
        create() { },
        update() { },
        destroy() { }
      }
    },
    virtual: 888
  };

  const admin = {
    ...common,
    ...app,
    config: { base: String },
    model: { compcerts: undefined },
    middleware: {
      token() { },
    },
    controller: {
      home: {
        index() { },
        details() { },
        add() { },
        update() { },
        delete() { }
      }
    },
    test: 999
  };

  const user = {
    ...common,
    ...app,
    config: {},
    middleware: {
      test() { },
      intercept() { }
    },
    controller: {
      home: {
        home() { },
      }
    }
  }

  const schema = types({
    argv: { default: [...string] },
    version: String,
    NODE_ENV: String,
    createApp() { },
    main,
    apps: { main, admin, user },
    components: {
      '@ioa/config': component,
      '@ioa/koa': component,
      '@common': component,
      ...object(component)
    },
  });

  const { data, error } = schema.verify(ioa);

  t.ok(data, error);

})
