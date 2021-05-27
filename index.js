import fs from 'fs';
import consoln from 'consoln';
import ioa from './lib/ioa.js';
import loadApp from './lib/loadApp.js';

const url = new URL('package.json', import.meta.url);
const packagePath = decodeURI(url.pathname);

const packageUtf8 = fs.readFileSync(packagePath, { encoding: 'utf8' });
const { version } = JSON.parse(packageUtf8);

console.log('');
consoln.log(`Ioa Framework V${version}`);
consoln.log(`NODE_ENV = '${ioa.NODE_ENV}'`);

ioa.version = version;
ioa.loadApp = loadApp;

export { version, loadApp };

export * from "./lib/ioa.js";

export default ioa;
