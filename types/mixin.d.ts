interface Object {
    [n: string]: any;
}
/**
* 深度合并两个对象，仅扩展原有的数据结构，只增不减
* @param { object } app 数据容器
* @param { object } join 需要加入到容器的数据
* @returns { undefined, string } 合并成功返回 undefined，合并失败时返回冲突属性 path
*/
export default function mixin(app: Object, join: Object): void | string;
export {};
