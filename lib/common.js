export const paths = {};
export const onames = {};
export const components = {};
export const applications = {};
export const loaders = [];

/**
 * 动态获取当前app
 * @param {String} name 应用名
 */
export function app(name) {

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

export const ioa = {
  app,
  onames,
  components,
  applications
};