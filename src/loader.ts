import fs from 'fs';
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
  level(options: LevelOptions, levels: object): void {

    const { imports, dirpath, root, data } = options;

    for (const name in imports) {

      const item = imports[name];

      if (toString.call(item) !== '[object Object]') continue;

      const { level, ...other } = item;

      const node: Node = { root, ...other };

      if (item.action) {

        node.path = dirpath;
        node.name = name;
        node.data = data;

      } else {

        const fullPath = Path.join(dirpath, name);

        let statSync;

        try {

          statSync = fs.statSync(fullPath);

        } catch (e) { }

        if (statSync) {

          // 文件类型
          if (statSync.isFile()) {

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
            node.children = fs.readdirSync(fullPath);
            node.data = {};

            data[dirname] = node.data;

          }

        } else {

          node.path = fullPath;
          node.error = 'invalid path';

        }

      }

      const queue = levels[level];

      if (queue) {

        queue.push(node);

      } else {

        levels[level] = [node];

      }

    }

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
      result = module(result, name);
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

    for (const item of children) {

      const fullPath = Path.join(path, item);
      const statSync = fs.statSync(fullPath);

      const node: Node = {
        path: fullPath,
        module,
        root
      };

      // 模块
      if (statSync.isFile()) {

        const match = item.match(regModule);

        if (match === null) continue;

        node.name = match[1];
        node.data = data;
        node.isFile = true;

      }

      // 目录
      else {

        if (excludes.includes(item)) continue;

        node.name = item;
        node.parents = data;
        node.children = fs.readdirSync(fullPath);
        node.directory = directory;

        node.data = {};
        data[item] = node.data; // 将子目录数据添加至父级

      }

      queue.push(node);

    }

    await this.loading({ queue }); // 装载子目录

    // 目录装载完毕后的数据处理函数
    if (directory) {

      parents[name] = directory(data, name);

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
          item.before(item);
        }
      }

      // 同级加载队列
      for (const item of queue) {

        // 模块类型
        if (item.isFile) {
          await this.module(item);
        }

        // 目录类型
        else if (item.children) {
          await this.directory(item);
        }

        // 函数类型
        else if (item.action) {
          item.data[item.name] = await item.action(item);
        }

      }

      // 后置钩子函数队列
      for (const item of queue) {

        if (item.after) {
          item.after(item);
        }

      }

    }

  }
}