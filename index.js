import fs from 'fs';
import consoln from 'consoln';
import apps from './lib/apps.js';
import component from './lib/component.js';
import { ioa, components, applications, app } from './lib/common.js';

const url = new URL('package.json', import.meta.url);
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

ioa.argv = argv;
ioa.version = version;
ioa.NODE_ENV = NODE_ENV;
ioa.component = component;
ioa.apps = apps;

console.log('');
consoln.log(`Ioa Framework V${version}`);
consoln.log(`NODE_ENV = ${NODE_ENV}`);

export {
  app,
  apps,
  component,
  components,
  applications,
};

export default ioa;
