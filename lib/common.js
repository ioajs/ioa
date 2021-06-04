export const cwd = process.cwd();
export const paths = [];
export const loaders = [];
export const onames = {};
export const components = {};
export const applications = {};

export const ioa = {
  cwd,
  onames,
  components,
  applications,
  /**
   * 动态获取当前app
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
};