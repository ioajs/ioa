/**
 * 装载单个或多个应用
 * @param appsOptions 应用配置
 */
export default function (appsOptions: {
    [name: string]: string;
}): Promise<void>;
