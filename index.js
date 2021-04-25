import fs from 'fs';
import consoln from 'consoln';
import argv from './lib/argv.js';
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

const cwd = process.cwd();

export default {
   argv,
   loadApp,
   apps: {},
   paths: {},
   components: {},
   loaders: [],
   NODE_ENV,
   cwd,
   version,
   // 获取当前动态app
   get app() {

      const { stack } = new Error();
      const atPath = stack.split('\n')[2];
      const [filePath] = atPath.match(/(\/[^\/]+)+/);
      const pathSplit = decodeURI(filePath).split('/');

      for (let i = pathSplit.length - 2; i > 0; i--) {
         pathSplit.pop();
         const path = pathSplit.join('/');
         const app = this.paths[path];
         if (app) {
            return app;
         }
      }

   }
};
