import fsp from 'fs/promises';
import { default as Path } from 'path';
const excludes = [
    'node_modules',
    '.DS_Store',
    '.git'
];
const regModule = /([^/\\]+)\.js$/;
const regDirectory = /(\w+)[/\\]?$/;
const { toString } = Object.prototype;
export default {
    async level(options, levels) {
        const { imports, dirpath, root, data } = options;
        const promises = [];
        for (const name in imports) {
            const item = imports[name];
            if (toString.call(item) !== '[object Object]')
                continue;
            const { level, ...other } = item;
            const node = { root, ...other };
            const queue = levels[level];
            if (queue) {
                queue.push(node);
            }
            else {
                levels[level] = [node];
            }
            if (item.action) {
                node.path = dirpath;
                node.name = name;
                node.data = data;
            }
            else {
                const fullPath = Path.join(dirpath, name);
                const promise = fsp.stat(fullPath).then(async (stat) => {
                    if (stat.isFile()) {
                        const [, filename] = fullPath.match(regModule);
                        node.name = filename;
                        node.path = fullPath;
                        node.data = data;
                        node.isFile = true;
                    }
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
                });
                promises.push(promise);
            }
        }
        await Promise.all(promises);
    },
    async module(options) {
        const { name, path, data, module } = options;
        let { default: result } = await import(path);
        if (module) {
            result = await module(result, name);
        }
        if (data[name] === undefined) {
            data[name] = result;
        }
    },
    async directory(options) {
        const { children, path, name, parents, root, data, module, directory } = options;
        const queue = [];
        const promises = [];
        for (const item of children) {
            const fullPath = Path.join(path, item);
            const promise = fsp.stat(fullPath).then(async (stat) => {
                const node = {
                    path: fullPath,
                    module,
                    root
                };
                if (stat.isFile()) {
                    const match = item.match(regModule);
                    if (match === null)
                        return;
                    node.name = match[1];
                    node.data = data;
                    node.isFile = true;
                }
                else {
                    if (excludes.includes(item))
                        return;
                    node.name = item;
                    node.parents = data;
                    node.children = await fsp.readdir(fullPath);
                    node.directory = directory;
                    node.data = {};
                    data[item] = node.data;
                }
                queue.push(node);
            });
            promises.push(promise);
        }
        await Promise.all(promises);
        await this.loading({ queue });
        if (directory) {
            parents[name] = await directory(data, name);
        }
    },
    async loading(levels) {
        for (const level in levels) {
            const queue = levels[level];
            for (const item of queue) {
                if (item.before) {
                    await item.before(item);
                }
            }
            const promises = [];
            for (const item of queue) {
                if (item.isFile) {
                    promises.push(this.module(item));
                }
                else if (item.children) {
                    promises.push(this.directory(item));
                }
                else if (item.action) {
                    item.data[item.name] = await item.action(item);
                }
            }
            await Promise.all(promises);
            for (const item of queue) {
                if (item.after) {
                    await item.after(item);
                }
            }
        }
    }
};
