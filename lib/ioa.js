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

const apps = {};
const components = {};
const paths = {};
const loaders = [];
const cwd = process.cwd();

export {
  cwd,
  argv,
  apps,
  components,
  paths,
  loaders
}

export default {
  cwd,
  argv,
  apps,
  components,
  paths,
  loaders,
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
}