import consoln from 'consoln';
import { readFile } from 'fs/promises';
import createApp from './createApp.js';
import { components, onames, paths } from './common.js';
import type { PartialComponent } from './common.js';
import main from './main.js';

const url = new URL('../package.json', import.meta.url);
const packagePath = decodeURI(url.pathname);

const packageUtf8 = await readFile(packagePath, { encoding: 'utf8' });
const { version } = JSON.parse(packageUtf8);

// argv参数解析
const [, , ...processArgv] = process.argv;
const argv: { default: string[], [n: string]: string[] } = { default: [] };

let key = 'default';

for (const item of processArgv) {
  const [one, two] = item;
  if (one === '-') {
    key = (two === '-') ? item.slice(2) : item.slice(1);
    argv[key] = [];
  } else {
    argv[key].push(item);
  }
}

let { NODE_ENV } = process.env;

if (NODE_ENV) {
  NODE_ENV = NODE_ENV.trim();
} else if (argv.env) {
  NODE_ENV = argv.env[0];
} else {
  NODE_ENV = 'production';
}

console.log('');
consoln.log(`Ioa Framework v${version}`);
consoln.log(`NODE_ENV = ${NODE_ENV}`);

/**
 * 获取当前应用实例
 */
function app(): PartialComponent {

  const { stack } = new Error();
  const atPath = stack.split('\n')[2];
  const [filePath] = atPath.match(/(\/[^/]+)+/);
  const pathSplit = decodeURI(filePath).split('/');

  pathSplit.pop();

  while (pathSplit.length) {
    const path = pathSplit.join('/');
    const app = paths[path];
    pathSplit.pop();
    if (app) return app;
  }

}

export {
  argv,
  version,
  NODE_ENV,
  onames,
  components,
  main,
  createApp,
  app,
};

export default main;
