import fsp from 'fs/promises';
import { default as Path } from 'path';

interface Node {
  name?: string
  path: string
  module: object
  root: object
  data?: object
  isFile?: boolean
  directory?: unknown
  children?: unknown
  parents?: unknown
  error?: string
}

const excludes = [
  'node_modules',
  '.DS_Store',
  '.git'
];

const regModule = /([^/\\]+)\.js$/;
const regDirectory = /(\w+)[/\\]?$/;
const { toString } = Object.prototype;

interface LevelOptions {
  imports: object
  dirpath: string
  root: object
  data: object
}

/**
 * 执行装载器队列
 */
export default {
  /**
  * 按加载等级对加载项进行分组
  * @param options 组件加载器配置信息
  * @param levels 保存目录、模块分级加载结果的容器
  */
  async level(options: LevelOptions, levels: object): Promise<void> {

    const { imports, dirpath, root, data } = options;

    const promises = [];

    for (const name in imports) {

      const item = imports[name];

      if (toString.call(item) !== '[object Object]') continue;

      const { level, ...other } = item;

      const node: Node = { root, ...other };

      const queue = levels[level];

      if (queue) {
        queue.push(node);
      } else {
        levels[level] = [node];
      }

      if (item.action) {

        node.path = dirpath;
        node.name = name;
        node.data = data;

      } else {

        const fullPath = Path.join(dirpath, name);

        const promise = fsp.stat(fullPath).then(async stat => {

          // 文件类型
          if (stat.isFile()) {

            // js模块类型
            const [, filename] = fullPath.match(regModule);

            node.name = filename;
            node.path = fullPath;
            node.data = data;
            node.isFile = true;

          }

          // 目录类型
          else {

            const [, dirname] = name.match(regDirectory);

            node.name = dirname;
            node.path = fullPath;
            node.parents = data;
            node.children = await fsp.readdir(fullPath);
            node.data = {};

            data[dirname] = node.data;

          }

        }).catch(e => {

          node.path = fullPath;
          node.error = 'invalid path';

        })

        promises.push(promise)

      }

    }

    await Promise.all(promises);

  },
  /**
   * 装载模块
   * @param options 加载选项
   */
  async module(options) {

    const { name, path, data, module } = options;

    let { default: result } = await import(path);

    // 模块导出数据处理函数
    if (module) {
      result = await module(result, name);
    }

    if (data[name] === undefined) {
      data[name] = result;
    }

  },
  /**
   * 递归装载目录
   * @param options 加载选项
   */
  async directory(options) {

    const { children, path, name, parents, root, data, module, directory } = options;

    const queue = [];

    const promises = [];

    for (const item of children) {

      const fullPath = Path.join(path, item);

      const promise = fsp.stat(fullPath).then(stat => {

        const node: Node = {
          path: fullPath,
          module,
          root
        };

        // 模块
        if (stat.isFile()) {

          const match = item.match(regModule);

          if (match === null) return;

          node.name = match[1];
          node.data = data;
          node.isFile = true;

        }

        // 目录
        else {

          if (excludes.includes(item)) return;

          node.name = item;
          node.parents = data;
          node.children = fsp.readdir(fullPath);
          node.directory = directory;

          node.data = {};
          data[item] = node.data; // 将子目录数据添加至父级

        }

        queue.push(node);

      })

      promises.push(promise)

    }

    await Promise.all(promises);

    await this.loading({ queue }); // 装载子目录

    // 目录装载完毕后的数据处理函数
    if (directory) {

      parents[name] = await directory(data, name);

    }

  },
  /**
   * 按分级顺序递归加载目录、模块
   * @param levels 待加载目录、模块队列
   */
  async loading(levels: object) {

    for (const level in levels) {

      const queue = levels[level];

      // 前置钩子函数队列
      for (const item of queue) {
        if (item.before) {
          await item.before(item);
        }
      }

      const promises = [];

      // 同级加载队列
      for (const item of queue) {

        // 模块类型
        if (item.isFile) {
          promises.push(this.module(item))
        }

        // 目录类型
        else if (item.children) {
          promises.push(this.directory(item))
        }

        // 函数类型
        else if (item.action) {
          item.data[item.name] = await item.action(item);
        }

      }

      await Promise.all(promises);

      // 后置钩子函数队列
      for (const item of queue) {

        if (item.after) {
          await item.after(item);
        }

      }

    }

  }
}