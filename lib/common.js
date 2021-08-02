export const paths = [];
export const loaders = [];
export const onames = {};
export const components = {};
export const applications = {};

/**
 * 动态获取当前app
 * @param {String} name 应用名
 */
export function app(name) {

  if (name) {
    return applications[name];
  } else {
    const { stack } = new Error();
    const atPath = stack.split('\n')[2];
    const [filePath] = atPath.match(/(\/[^/]+)+/);
    const pathSplit = decodeURI(filePath).split('/');

    for (let i = pathSplit.length - 2; i > 0; i--) {
      pathSplit.pop();
      const path = pathSplit.join('/');
      const app = paths[path];
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