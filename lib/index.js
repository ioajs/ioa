import fs from 'fs';
import consoln from 'consoln';
import apps from './apps.js';
import component from './component.js';
import { components, applications, onames, paths } from './common.js';

const url = new URL('../package.json', import.meta.url);
const packagePath = decodeURI(url.pathname);

const packageUtf8 = fs.readFileSync(packagePath, { encoding: 'utf8' });
const { version } = JSON.parse(packageUtf8);

// argv参数解析
const [, , ...processArgv] = process.argv;
const argv = { default: [] };

let key = 'default';

for (const item of processArgv) {
  if (item[0] === '-') {
    key = item.replace(/^-{1,2}/, '');
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
consoln.log(`Ioa Framework V${version}`);
consoln.log(`NODE_ENV = ${NODE_ENV}`);


/**
 * 动态获取当前app
 * @param {String} name 应用名
 */
function app(name) {

  if (name) {
    const app = applications[name];
    if (app) {
      return app;
    } else {
      throw new Error(`找不到应用"${name}"`);
    }
  } else {

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

}

export {
  app,
  apps,
  onames,
  component,
  components,
  applications,
  version,
  argv,
  NODE_ENV
};

export default {
  app,
  apps,
  onames,
  component,
  components,
  applications,
  version,
  argv,
  NODE_ENV
}