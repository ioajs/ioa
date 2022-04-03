import path from 'path';
import consoln from 'consoln';
import mixin from './mixin.js';
import { components, apps, paths, loaders, onames } from './common.js';
const cwd = process.cwd();
const pathRegExp = /\/([^/]+)\/?$/;
/**
 * 创建应用组件实例（不加载模块，仅创建空实例，建立依赖关系）
 * @param { string } oname 原始组件名或路径
 * @param { object } app 应用容器
 */ export function createApp(oname, app) {
    let $path, $name;
    const [point] = oname[0];
    // 相对路径
    if (point === '.') {
        $path = path.join(cwd, oname);
        const [, name] = oname.match(pathRegExp);
        $name = name;
    } else if (path.isAbsolute(oname)) {
        $path = path.join(oname);
        const [name] = oname.match(pathRegExp);
        $name = name;
    } else {
        throw consoln.error(`无效的应用路径"${oname}"`);
    }
    Object.assign(app, {
        $name,
        $path,
        $import: {},
        $components: {},
        $export: {},
        component (name) {
            if (typeof name !== 'string') return;
            const dependencyComponent = createComponent(name, app);
            const error = mixin(app, dependencyComponent.$export);
            if (error) {
                const mixinError = new Error(`${$name} 应用与 ${name} 依赖组件导出对象之间存在属性合并冲突，${error}`);
                throw consoln.error(mixinError);
            }
            return dependencyComponent;
        },
        import (options) {
            const error = mixin(app.$import, options);
            if (error) {
                const mixinError = new Error(`${$name} 应用 import 选项中存在属性合并冲突，${error}`);
                throw consoln.error(mixinError);
            }
        }
    });
    paths[$path] = app;
    onames[oname] = app;
    components[$name] = app;
    apps[$name] = app;
    loaders.push(app);
}
/**
 * 创建组件实例或导出已缓存的组件（不加载模块，仅创建空实例，建立依赖关系）
 * @param { string } oname 原始组件名或路径
 * @param { object } subscribe 订阅者
 * @returns { object } 组件实例
 */ export function createComponent(oname, subscribe) {
    const cacheComponent = onames[oname];
    if (cacheComponent) {
        cacheComponent.$release[subscribe.$name] = subscribe;
        subscribe.$components[cacheComponent.$name] = cacheComponent;
        return cacheComponent;
    }
    let $path, $name;
    const [point] = oname[0];
    // 相对路径
    if (point === '.') {
        $path = path.join(cwd, oname);
        const [, name] = oname.match(pathRegExp);
        $name = name;
    } else if (path.isAbsolute(oname)) {
        $path = path.join(oname);
        const [name] = oname.match(pathRegExp);
        $name = name;
    } else {
        $path = path.join(cwd, 'node_modules', oname, 'lib');
        $name = oname;
    }
    const component = {
        $name,
        $path,
        $import: {},
        $components: {},
        $release: {
            [subscribe.$name]: subscribe
        },
        $export: {},
        $init: false,
        component (name) {
            if (typeof name !== 'string') return;
            const dependencyComponent = createComponent(name, component);
            const error = mixin(component, dependencyComponent.$export);
            if (error) {
                const mixinError = new Error(`$${$name} 组件与 ${dependencyComponent.$name} 依赖组件导出对象之间存在属性合并冲突，${error}`);
                throw consoln.error(mixinError);
            }
            return dependencyComponent;
        },
        import (options) {
            const error = mixin(component.$import, options);
            if (error) {
                const mixinError = new Error(`${$name} 组件 import(options) 中存在属性合并冲突，${error}`);
                throw consoln.error(mixinError);
            }
        },
        export (options) {
            const { $release , $export  } = component;
            for(const key in options){
                const value = options[key];
                for(const name in $release){
                    const release = $release[name];
                    const error = mixin(release, {
                        [key]: value
                    });
                    if (error) {
                        const newError = new Error(`${name}组件与${$name}子组件之间存在属性合并冲突，$${error}`);
                        throw consoln.error(newError);
                    }
                }
                // 缓存所有已发送的数据，让后注册的订阅器也能获取到之前发送的数据
                $export[key] = value;
            }
        }
    };
    paths[$path] = component;
    onames[oname] = component;
    components[$name] = component;
    subscribe.$components[$name] = component;
    loaders.push(component);
    return component;
}
