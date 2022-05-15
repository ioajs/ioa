import test from 'jtm';
import ioa, { argv, version, NODE_ENV, components, createApp, app } from 'ioa';
import types, { $index, string, number, func, object } from 'typea';

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

test('ioa export', t => {

  const schema = types({
    argv: { default: [...string] },
    version: String,
    NODE_ENV: String,
    createApp() { },
    app() { },
    components: {
      '@ioa/config': component,
      '@ioa/koa': component,
      '@common': component,
      ...object(component)
    },
  });

  const { data, error } = schema.verify({
    argv,
    version,
    NODE_ENV,
    components,
    createApp,
    app
  });

  t.ok(data, error);

})

test('ioa export default', t => {

  const app = {
    middlewareBefore: [...Function],
    router: {
      get() { },
      post() { },
      put() { },
      delete() { },
      resources() { }
    },
  };

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
  }

  const schema = types(main);

  const { data, error } = schema.verify(ioa);

  t.ok(data, error);

})
