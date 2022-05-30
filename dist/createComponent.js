import path from 'path';
import { readFileSync } from 'fs';
import consoln from 'consoln';
import mixin from './mixin.js';
import common, { components, paths, loaders, onames } from './common.js';
const cwd = process.cwd();
const cwdSplit = cwd.split('/');
const packagePaths = [];
const { length } = cwdSplit;
for (let index = length; index > 0; index--) {
    const sliceArray = cwdSplit.slice(0, index);
    sliceArray.push('node_modules');
    packagePaths.push(path.join(sliceArray.join('/')));
}
const pathRegExp = /\/([^/]+)\/?$/;
export default function createComponent(oname, subscribe) {
    const cacheComponent = onames[oname];
    if (cacheComponent) {
        cacheComponent.$release[subscribe.$name] = subscribe;
        subscribe.$components[cacheComponent.$name] = cacheComponent;
        return cacheComponent;
    }
    let $base, $entry, $name;
    const [first] = oname[0];
    if (first === '.') {
        $base = path.join(common.basePath, oname);
        $entry = path.join($base, 'index.js');
        const [, name] = oname.match(pathRegExp);
        $name = name;
    }
    else if (first === '/') {
        $base = path.join(oname);
        $entry = path.join($base, 'index.js');
        const [name] = oname.match(pathRegExp);
        $name = name;
    }
    else {
        $name = oname;
        for (const item of packagePaths) {
            const basePath = path.join(item, oname);
            const packagePath = path.join(basePath, 'package.json');
            try {
                const packageString = readFileSync(packagePath, { encoding: 'utf8' });
                const packageObject = JSON.parse(packageString);
                $entry = path.join(basePath, packageObject.main || "lib/index.js");
                $base = path.join($entry, '..');
                break;
            }
            catch (e) { }
        }
        if ($entry === undefined) {
            throw consoln.error(new Error(`找不到 npm 模块 "${oname}"`));
        }
    }
    const component = {
        $name,
        $base,
        $entry,
        $init: false,
        $import: {},
        $components: {},
        $release: { [subscribe.$name]: subscribe },
        $export: {},
        component(name) {
            if (typeof name !== 'string')
                return;
            const dependencyComponent = createComponent(name, component);
            const error = mixin(component, dependencyComponent.$export);
            if (error) {
                const mixinError = new Error(`${$name} 组件与 ${dependencyComponent.$name} 组件之间存在关联属性合并冲突，${$name}${error}`);
                throw consoln.error(mixinError);
            }
            return dependencyComponent;
        },
        import(options) {
            const error = mixin(component.$import, options);
            if (error) {
                const mixinError = new Error(`${$name} 组件 import(options) 中存在关联属性合并冲突，${$name}${error}`);
                throw consoln.error(mixinError);
            }
        },
        export(options) {
            const { $release, $export } = component;
            for (const key in options) {
                const value = options[key];
                for (const name in $release) {
                    const release = $release[name];
                    const error = mixin(release, { [key]: value });
                    if (error) {
                        const mixinError = new Error(`${name} 组件与 ${$name} 组件之间存在关联属性合并冲突，${name}${error}`);
                        throw consoln.error(mixinError);
                    }
                }
                $export[key] = value;
            }
        }
    };
    paths[$base] = component;
    onames[oname] = component;
    components[$name] = component;
    subscribe.$components[$name] = component;
    loaders.push(component);
    return component;
}
