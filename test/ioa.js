import test from 'jtm';
import {  argv, version, NODE_ENV, components, createApp, app } from 'ioa';
import { Schema, $index, string, number, func, object } from 'typea';

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

test('ioa', t => {

  const schema = Schema({
    argv: { default: [...string] },
    version: String,
    NODE_ENV: String,
    createApp() { },
    app() { },
    components: {
      '@ioa/config': component,
      '@ioa/http': component,
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
