export const loaders = [];
export const onames = {}; // 原始 name、path 映射实例
export const paths = {}; // path 映射实例，用于 ioa.app() 中的错误路径匹配
/** 所有组件实例集合*/
export const components = {};
/** 所有应用实例集合*/
export const apps = {
    /** 主应用实例 */
    main: {}
};
