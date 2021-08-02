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
    const application = applications[name];
    if (application) {
      return application;
    } else {
      throw new Error(`找不到应用"${name}"`);
    }
  } else {
    const { stack } = new Error();
    const atPath = stack.split('\n')[2];
    const [filePath] = atPath.match(/(\/[^/]+)+/);
    const pathSplit = decodeURI(filePath).split('/');
    for (let i = pathSplit.length - 2; i > 0; i--) {
      pathSplit.pop();
      const path = pathSplit.join('/');
      const application = paths[path];
      if (application) return application;
    }
  }

}

export const ioa = {
  app,
  onames,
  components,
  applications
};