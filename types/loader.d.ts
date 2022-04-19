interface LevelOptions {
    imports: object;
    dirpath: string;
    root: object;
    data: object;
}
declare const _default: {
    /**
    * 按加载等级对加载项进行分组
    * @param { object } options 组件加载器配置信息
    * @param { object } levels 保存目录、模块分级加载结果的容器
    */
    level(options: LevelOptions, levels: object): void;
    /**
     * 装载模块
     * @param { object } options 加载选项
     */
    module(options: any): Promise<void>;
    /**
     * 递归装载目录
     * @param { object } options 加载选项
     */
    directory(options: any): Promise<void>;
    /**
     * 按分级顺序递归加载目录、模块
     * @param { object } levels 待加载目录、模块队列
     */
    loading(levels: object): Promise<void>;
};
/**
 * 执行装载器队列
 */
export default _default;
