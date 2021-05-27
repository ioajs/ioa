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

const apps = {};
const paths = {};
const loaders = [];
const components = {};
const cwd = process.cwd();

export {
  cwd,
  argv,
  apps,
  components,
  paths,
  loaders,
  NODE_ENV
}

export default {
  cwd,
  argv,
  apps,
  components,
  paths,
  loaders,
  NODE_ENV,
  /**
   * 获取当前动态app
   */
  get app() {

    const { stack } = new Error();
    const atPath = stack.split('\n')[2];
    const [filePath] = atPath.match(/(\/[^/]+)+/);
    const pathSplit = decodeURI(filePath).split('/');

    let app;

    for (let i = pathSplit.length - 2; i > 0; i--) {
      pathSplit.pop();
      const path = pathSplit.join('/');
      app = paths[path];
      if (app) break;
    }

    return app;

  }
}