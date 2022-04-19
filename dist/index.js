import fs from 'fs';
import consoln from 'consoln';
import createApp from './createApp.js';
import { createComponent } from './createComponent.js';
import { apps, components, onames, paths } from './common.js';
const url = new URL('../package.json', import.meta.url);
const packagePath = decodeURI(url.pathname);
const packageUtf8 = fs.readFileSync(packagePath, { encoding: 'utf8' });
const { version } = JSON.parse(packageUtf8);
// argv参数解析
const [, , ...processArgv] = process.argv;
const argv = { default: [] };
let key = 'default';
for (const item of processArgv) {
    const [one, two] = item;
    if (one === '-') {
        key = (two === '-') ? item.slice(2) : item.slice(1);
        argv[key] = [];
    }
    else {
        argv[key].push(item);
    }
}
let { NODE_ENV } = process.env;
if (NODE_ENV) {
    NODE_ENV = NODE_ENV.trim();
}
else if (argv.env) {
    NODE_ENV = argv.env[0];
}
else {
    NODE_ENV = 'production';
}
console.log('');
consoln.log(`Ioa Framework v${version}`);
consoln.log(`NODE_ENV = ${NODE_ENV}`);
/**
 * 获取指定应用实例，缺失状态下获取当前应用实例
 * @param {string} name 应用名称
 */
function app(name) {
    if (name) {
        const app = apps[name];
        if (app) {
            return app;
        }
        else {
            throw new Error(`找不到应用"${name}"`);
        }
    }
    else {
        const { stack } = new Error();
        const atPath = stack.split('\n')[2];
        const [filePath] = atPath.match(/(\/[^/]+)+/);
        const pathSplit = decodeURI(filePath).split('/');
        pathSplit.pop();
        while (pathSplit.length) {
            const path = pathSplit.join('/');
            const app = paths[path];
            pathSplit.pop();
            if (app)
                return app;
        }
    }
}
const { main } = apps;
const ioa = {
    app,
    apps,
    main,
    onames,
    components,
    argv,
    NODE_ENV,
    version,
    createApp,
    createComponent,
};
export { app, apps, main, onames, components, version, argv, NODE_ENV, createApp, createComponent, };
export default ioa;
