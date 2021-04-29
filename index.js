import fs from 'fs';
import consoln from 'consoln';
import ioa from './lib/ioa.js';
import loadApp from './lib/loadApp.js';

const url = new URL('package.json', import.meta.url);
const packagePath = decodeURI(url.pathname);

const packageUtf8 = fs.readFileSync(packagePath, { encoding: 'utf8' });
const { version } = JSON.parse(packageUtf8);

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
consoln.log(`NODE_ENV = '${NODE_ENV}'`);

ioa.NODE_ENV = NODE_ENV;
ioa.version = version;
ioa.loadApp = loadApp;

export { NODE_ENV, version, loadApp };

export * from "./lib/ioa.js";

export default ioa;
