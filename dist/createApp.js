import consoln from 'consoln';
import loader from './loader.js';
import { loaders } from './common.js';
import main, { createMain } from './main.js';
/**
 * 使用深度优先策略，递归预装载所有组件的 index 入口文件
 */
async function recursionIndex(components) {
    const imports = {}; // 待加载组件
    for (const name in components) {
        const component = components[name];
        if (!component.$init) {
            imports[name] = component;
        }
    }
    if (Object.keys(imports).length === 0)
        return;
    for (const name in imports) {
        const component = imports[name];
        const { $entry } = component;
        const { default: options } = await import($entry).catch(error => {
            consoln.error(`"${component.$name}" 组件入口文件加载失败, "${$entry}"`);
            throw consoln.error(error);
        });
        // 模块有返回值时，表示使用声明式对象
        if (options) {
            if (options.component) {
                for (const name of options.component) {
                    await component.component(name);
                }
            }
            if (options.import) {
                component.import(options.import);
            }
            if (options.export) {
                component.export(options.export);
            }
        }
        component.$init = true;
    }
    for (const name in imports) {
        const component = imports[name];
        const { $components } = component;
        await recursionIndex($components);
    }
}
/**
 * 装载根应用
 * @param mainPath 应用装载路径
 */
export default async function (mainPath) {
    createMain(mainPath);
    await recursionIndex({ main });
    /////////////// 根据加载时序，预先对应用进行分级排序 ///////////////
    const levels = {};
    const promises = [];
    for (const component of loaders) {
        promises.push(loader.level({
            dirpath: component.$base,
            root: component,
            data: component,
            imports: component.$import
        }, levels));
    }
    await Promise.all(promises);
    // 显示加载时序
    console.log('\n\x1b[32m******************************** ioa loader **********************\n');
    for (const level in levels) {
        console.log(`\x1b[32m${level}›--------------------------------------------------------`);
        const filter = [];
        const queue = levels[level];
        for (const item of queue) {
            if (item.error === undefined) {
                filter.push(item);
                if (item.isFile) {
                    console.log(`\x1b[36m›  ${item.path}`);
                }
                else if (item.children) {
                    console.log(`\x1b[34m#  ${item.path}/ [${item.children.length}]`);
                }
                else if (item.action) {
                    console.log(`\x1b[35m*  ${item.path}/index.js ${item.name}()`);
                }
            }
            else {
                // console.error(`${item.path},`, item.error);
                console.log(`\x1b[33m!  ${item.path}`);
            }
        }
        levels[level] = filter;
    }
    console.log(`\n\x1b[32m*******************************************************************\x1b[30m\n`);
    // 异步加载所有模块
    await loader.loading(levels);
}
