import test from 'jtm';
import { main } from 'ioa';
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

test('main', t => {

  const schema = Schema({
    ...common,
    config: {
      "@ioa/http": {
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
    controller: {},
    virtual: 888
  });

  const { data, error } = schema.verify(main);

  t.ok(data, error);

})
