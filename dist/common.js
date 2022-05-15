/** 待加载应用队列 */
export const loaders = [];
export const onames = {}; // 原始 name、path 映射实例
export const paths = {}; // path 映射实例，用于 ioa.app() 中的错误路径匹配
/** 所有组件实例集合*/
export const components = {};
