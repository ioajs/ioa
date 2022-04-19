import createApp from './createApp.js';
import { createComponent } from './createComponent.js';
import { apps, components, onames } from './common.js';
import type { PartialComponent } from './common.js';
declare const version: any;
declare const argv: {
    default: string[];
    [n: string]: string[];
};
declare let NODE_ENV: string;
/**
 * 获取指定应用实例，缺失状态下获取当前应用实例
 * @param {string} name 应用名称
 */
declare function app(name?: string): PartialComponent;
declare const main: PartialComponent;
declare const ioa: {
    app: typeof app;
    apps: import("./common.js").Apps;
    main: PartialComponent;
    onames: PartialComponent;
    components: import("./common.js").Components;
    argv: {
        [n: string]: string[];
        default: string[];
    };
    NODE_ENV: string;
    version: any;
    createApp: typeof createApp;
    createComponent: typeof createComponent;
};
export { app, apps, main, onames, components, version, argv, NODE_ENV, createApp, createComponent, };
export default ioa;
